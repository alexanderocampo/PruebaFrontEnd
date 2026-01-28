import { Injectable, signal, computed, effect } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  
  totalPrice = computed(() => {
    return this.cartItems().reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  });
  
  totalCount = computed(() => {
    return this.cartItems().reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  });
  
  items = computed(() => this.cartItems());

  constructor() {
    effect(() => {
      const items = this.cartItems();
      const total = this.totalPrice();
      const count = this.totalCount();
      
      console.log('🛒 Carrito actualizado:', {
        items: items.map(item => ({
          product: item.product.name,
          quantity: item.quantity,
          subtotal: item.product.price * item.quantity
        })),
        totalItems: count,
        totalPrice: total
      });
    });
  }

  addItem(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems();
    const existingItemIndex = currentItems.findIndex(
      item => item.product.id === product.id
    );

    if (existingItemIndex > -1) {
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity
      };
      this.cartItems.set(updatedItems);
    } else {
      const newItem: CartItem = {
        product,
        quantity
      };
      this.cartItems.set([...currentItems, newItem]);
    }
  }

  removeItem(productId: number): void {
    const updatedItems = this.cartItems().filter(
      item => item.product.id !== productId
    );
    this.cartItems.set(updatedItems);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const updatedItems = this.cartItems().map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    this.cartItems.set(updatedItems);
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  getItem(productId: number): CartItem | undefined {
    return this.cartItems().find(item => item.product.id === productId);
  }
}