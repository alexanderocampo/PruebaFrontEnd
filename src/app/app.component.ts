import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerSearchComponent } from './components/customer-search/customer-search.component';
import { CartDemoComponent } from './components/cart-demo/cart-demo-component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CustomerSearchComponent, CartDemoComponent],
  template: `
    <div class="app-container">
      <header>
        <h1>Prueba Técnica Frontend</h1>
      </header>
      
      <main>
        <section class="exercise">
          <h2>Ejercicio 1: Búsqueda Reactiva</h2>
          <app-customer-search></app-customer-search>
        </section>
        
        <section class="exercise">
          <h2>Ejercicio 2: Carrito con Signals</h2>
          <app-cart-demo></app-cart-demo>
        </section>
      </main>
      
      <footer>
        <p>Prueba técnica completada</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    
    header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #007bff;
    }
    
    .exercise {
      margin-bottom: 50px;
      padding: 20px;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      background-color: #f8f9fa;
    }
    
    footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #dee2e6;
      color: #6c757d;
    }
  `]
})
export class AppComponent {}