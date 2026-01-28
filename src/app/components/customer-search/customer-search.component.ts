import { Component, inject, signal, effect, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { 
  debounceTime, 
  distinctUntilChanged, 
  filter, 
  switchMap,
  tap,
  catchError,
  finalize
} from 'rxjs/operators';
import { MockService, Customer } from '../../services/mock.service';

@Component({
  selector: 'app-customer-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-container">
      <h2>🔍 Búsqueda de Clientes</h2>
      
      <div class="search-box">
        <input
          type="text"
          [ngModel]="searchTerm()"
          (ngModelChange)="onSearchTermChange($event)"
          placeholder="Escribe al menos 3 caracteres..."
          class="search-input"
          [class.input-warning]="showMinLengthWarning()"
        />
        
        <button 
          (click)="clearSearch()" 
          class="clear-btn"
          [disabled]="!searchTerm()"
        >
          Limpiar
        </button>
        
        <div *ngIf="isLoading()" class="loading-indicator">
          <div class="spinner"></div>
          Buscando...
        </div>
      </div>

      <!-- Mensajes de estado -->
      <div class="messages">
        <div *ngIf="showMinLengthWarning()" class="message warning">
          ⚠️ Escribe al menos 3 caracteres
        </div>
        
        <div *ngIf="isLoading() && !showMinLengthWarning()" class="message loading">
          🔍 Buscando clientes...
        </div>
        
        <div *ngIf="error()" class="message error">
          ❌ {{ error() }}
        </div>
        
        <div *ngIf="showNoResults()" class="message no-results">
          📭 No se encontraron resultados para "{{ searchTerm() }}"
        </div>
        
        <div *ngIf="customers().length > 0" class="message success">
          ✅ Encontrados {{ customers().length }} cliente(s)
        </div>
      </div>

      <!-- Resultados -->
      <div *ngIf="customers().length > 0" class="results-container">
        <h3>Resultados ({{ customers().length }})</h3>
        <ul class="customer-list">
          <li *ngFor="let customer of customers(); trackBy: trackById" class="customer-item">
            <div class="customer-avatar">
              {{ customer.name.charAt(0) }}
            </div>
            <div class="customer-info">
              <strong>{{ customer.name }}</strong>
              <span>{{ customer.email }}</span>
            </div>
            <span class="customer-id">ID: {{ customer.id }}</span>
          </li>
        </ul>
      </div>

      <!-- Información de debug -->
      <div *ngIf="debugInfo()" class="debug-info">
        <small>
          Última búsqueda: {{ debugInfo()?.lastSearch || 'Ninguna' }} | 
          Tiempo: {{ debugInfo()?.searchTime || 0 }}ms
        </small>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      max-width: 800px;
      margin: 20px auto;
      padding: 24px;
      font-family: Arial, sans-serif;
      background: #f8f9fa;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    h2 {
      color: #2c3e50;
      margin-bottom: 24px;
      text-align: center;
    }

    .search-box {
      position: relative;
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .search-input {
      flex: 1;
      padding: 14px 16px;
      font-size: 16px;
      border: 2px solid #ddd;
      border-radius: 8px;
      box-sizing: border-box;
      transition: all 0.3s;
    }

    .search-input:focus {
      outline: none;
      border-color: #4a90e2;
      box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
    }

    .search-input.input-warning {
      border-color: #ff9800;
      background-color: #fff8e1;
    }

    .clear-btn {
      padding: 14px 24px;
      background: #e74c3c;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s;
      white-space: nowrap;
    }

    .clear-btn:hover:not(:disabled) {
      background: #c0392b;
      transform: translateY(-1px);
    }

    .clear-btn:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .loading-indicator {
      position: absolute;
      right: 140px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      gap: 8px;
      color: #4a90e2;
      font-size: 14px;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid #f3f3f3;
      border-top: 2px solid #4a90e2;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .messages {
      margin-bottom: 20px;
      min-height: 60px;
    }

    .message {
      padding: 12px 16px;
      border-radius: 6px;
      margin-bottom: 8px;
      font-size: 14px;
      animation: fadeIn 0.3s ease;
    }

    .message.warning {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      color: #856404;
    }

    .message.loading {
      background: #d1ecf1;
      border: 1px solid #bee5eb;
      color: #0c5460;
    }

    .message.error {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }

    .message.no-results {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      color: #6c757d;
      text-align: center;
    }

    .message.success {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
    }

    .results-container {
      margin-top: 20px;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .customer-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .customer-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      margin-bottom: 12px;
      background: white;
      border-radius: 8px;
      border: 1px solid #e9ecef;
      transition: all 0.2s;
    }

    .customer-item:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-color: #4a90e2;
    }

    .customer-avatar {
      width: 40px;
      height: 40px;
      background: #4a90e2;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 18px;
    }

    .customer-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .customer-info strong {
      color: #333;
      margin-bottom: 4px;
      font-size: 16px;
    }

    .customer-info span {
      color: #666;
      font-size: 14px;
    }

    .customer-id {
      color: #888;
      font-size: 12px;
      font-weight: bold;
      background: #f8f9fa;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .debug-info {
      margin-top: 20px;
      padding-top: 12px;
      border-top: 1px dashed #dee2e6;
      text-align: center;
      color: #6c757d;
      font-size: 12px;
    }

    @media (max-width: 768px) {
      .search-box {
        flex-direction: column;
      }
      
      .clear-btn {
        width: 100%;
      }
      
      .loading-indicator {
        position: static;
        transform: none;
        justify-content: center;
        margin-top: 10px;
      }
      
      .customer-item {
        flex-direction: column;
        text-align: center;
        gap: 12px;
      }
      
      .customer-info {
        text-align: center;
      }
    }
  `]
})
export class CustomerSearchComponent {
  private mockService = inject(MockService);
  private destroyRef = inject(DestroyRef);
  private searchSubject = new Subject<string>();

  searchTerm = signal('');
  customers = signal<Customer[]>([]);
  isLoading = signal(false);
  error = signal('');
  debugInfo = signal<{lastSearch: string, searchTime: number} | null>(null);

  showMinLengthWarning = () => this.searchTerm().length > 0 && this.searchTerm().length < 3;
  showNoResults = () => 
    !this.isLoading() && 
    this.searchTerm().length >= 3 && 
    this.customers().length === 0 && 
    !this.error();

  constructor() {
    this.setupSearchPipeline();
  }

  onSearchTermChange(term: string) {
    this.searchTerm.set(term);
    this.searchSubject.next(term);
  }

  private setupSearchPipeline() {
    this.searchSubject.pipe(
      // Esperar 400ms después de que el usuario deje de escribir
      debounceTime(400),
      
      // No buscar si el texto es igual al anterior
      distinctUntilChanged(),
      
      // No buscar si el texto tiene menos de 3 caracteres
      filter(term => term.length === 0 || term.length >= 3),
      
      // Actualizar estado antes de la búsqueda
      tap(term => {
        if (term.length === 0) {
          this.customers.set([]);
          this.error.set('');
          this.debugInfo.set(null);
          return;
        }
        
        console.log(`🔍 Iniciando búsqueda: "${term}"`);
        this.isLoading.set(true);
        this.error.set('');
        this.customers.set([]);
      }),
      
      // Cancelar petición anterior si hay una nueva
      switchMap(term => {
        if (term.length === 0) {
          return [];
        }
        
        const startTime = Date.now();
        
        return this.mockService.search(term).pipe(
          tap(results => {
            const searchTime = Date.now() - startTime;
            this.debugInfo.set({
              lastSearch: term,
              searchTime
            });
            console.log(`✅ Búsqueda completada en ${searchTime}ms, resultados: ${results.length}`);
          }),
          catchError(error => {
            console.error('❌ Error en búsqueda:', error);
            this.error.set('Error al buscar clientes. Por favor, intente nuevamente.');
            return [];
          }),
          finalize(() => {
            this.isLoading.set(false);
          })
        );
      }),
      
      // TakeUntilDestroyed: Limpiar suscripciones automáticamente
      takeUntilDestroyed(this.destroyRef)
      
    ).subscribe({
      next: (results) => {
        this.customers.set(results);
      },
      error: (error) => {
        console.error('❌ Error en el pipeline:', error);
        this.error.set('Error inesperado en la búsqueda');
        this.isLoading.set(false);
      }
    });
  }

  // TrackBy para optimizar rendimiento
  trackById(index: number, customer: Customer): number {
    return customer.id;
  }

  // Limpiar búsqueda
  clearSearch() {
    this.searchTerm.set('');
    this.customers.set([]);
    this.error.set('');
    this.isLoading.set(false);
    this.debugInfo.set(null);
    this.searchSubject.next('');
  }
}