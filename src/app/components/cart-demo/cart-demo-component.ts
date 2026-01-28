import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, Product } from '../../services/cart.service';

@Component({
  selector: 'app-cart-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-demo.component.html',
  styleUrls: ['./cart-demo.component.css']
})
export class CartDemoComponent {
  // Productos de ejemplo
  availableProducts: Product[] = [
    { id: 1, name: 'Laptop', price: 999.99 },
    { id: 2, name: 'Mouse', price: 29.99 },
    { id: 3, name: 'Teclado', price: 79.99 },
    { id: 4, name: 'Monitor', price: 249.99 },
    { id: 5, name: 'Audífonos', price: 149.99 }
  ];

  constructor(public cartService: CartService) {}

  addToCart(product: Product): void {
    this.cartService.addItem(product, 1);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeItem(productId);
  }

  increaseQuantity(productId: number): void {
    const item = this.cartService.items().find(i => i.product.id === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity + 1);
    }
  }

  decreaseQuantity(productId: number): void {
    const item = this.cartService.items().find(i => i.product.id === productId);
    if (item) {
      const newQuantity = item.quantity - 1;
      if (newQuantity <= 0) {
        this.cartService.removeItem(productId);
      } else {
        this.cartService.updateQuantity(productId, newQuantity);
      }
    }
  }
}