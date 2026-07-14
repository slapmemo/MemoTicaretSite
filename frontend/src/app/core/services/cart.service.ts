import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cart } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/cart`;

  private readonly cartSignal = signal<Cart | null>(null);

  readonly cart = this.cartSignal.asReadonly();
  readonly itemCount = computed(
    () => this.cartSignal()?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
  );

  refresh() {
    return this.http
      .get<Cart>(this.apiUrl)
      .pipe(tap((cart) => this.cartSignal.set(cart)));
  }

  addItem(productId: number, quantity = 1) {
    return this.http
      .post(`${this.apiUrl}/items`, { productId, quantity })
      .pipe(tap(() => this.refresh().subscribe()));
  }

  updateItem(itemId: number, quantity: number) {
    return this.http
      .put(`${this.apiUrl}/items/${itemId}`, { quantity })
      .pipe(tap(() => this.refresh().subscribe()));
  }

  removeItem(itemId: number) {
    return this.http
      .delete(`${this.apiUrl}/items/${itemId}`)
      .pipe(tap(() => this.refresh().subscribe()));
  }

  clearLocal() {
    this.cartSignal.set(null);
  }
}
