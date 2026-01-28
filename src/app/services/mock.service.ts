import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

export interface Customer {
  id: number;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class MockService {
  private mockCustomers: Customer[] = [
    { id: 1, name: 'Juan Pérez', email: 'juan@email.com' },
    { id: 2, name: 'María García', email: 'maria@email.com' },
    { id: 3, name: 'Carlos López', email: 'carlos@email.com' },
    { id: 4, name: 'Ana Martínez', email: 'ana@email.com' },
    { id: 5, name: 'Pedro Rodríguez', email: 'pedro@email.com' }
  ];

  search(term: string): Observable<Customer[]> {
    if (!term.trim()) {
      return of([]).pipe(delay(300));
    }

    const filtered = this.mockCustomers.filter(customer =>
      customer.name.toLowerCase().includes(term.toLowerCase()) ||
      customer.email.toLowerCase().includes(term.toLowerCase())
    );

    return of(filtered).pipe(delay(300));
  }

  // Método para Promise (si lo necesitas)
  async searchAsync(term: string): Promise<Customer[]> {
    const results = await this.search(term).toPromise();
    return results || [];
  }
}