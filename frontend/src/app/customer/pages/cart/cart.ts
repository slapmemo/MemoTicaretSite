import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { OrdersService } from '../../../core/services/orders.service';
import { Order } from '../../../core/models/order.model';
import { CartItem } from '../../../core/models/cart.model';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  private readonly cartService = inject(CartService);
  private readonly ordersService = inject(OrdersService);

  readonly cart = this.cartService.cart;
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly placingOrder = signal(false);
  readonly completedOrder = signal<Order | null>(null);

  readonly total = computed(() => {
    const items = this.cart()?.items ?? [];
    return items.reduce(
      (sum, item) => sum + Number(item.product?.price ?? 0) * item.quantity,
      0,
    );
  });

  constructor() {
    this.cartService.refresh().subscribe({
      next: () => this.loading.set(false),
      error: () => {
        this.errorMessage.set('Sepet yüklenemedi');
        this.loading.set(false);
      },
    });
  }

  updateQuantity(itemId: number, quantity: number): void {
    if (quantity < 1) return;
    this.cartService.updateItem(itemId, quantity).subscribe({
      error: () => this.errorMessage.set('Adet güncellenemedi'),
    });
  }

  removeItem(itemId: number): void {
    this.cartService.removeItem(itemId).subscribe({
      error: () => this.errorMessage.set('Ürün sepetten çıkarılamadı'),
    });
  }

  lineTotal(item: CartItem): number {
    return Number(item.product?.price ?? 0) * item.quantity;
  }

  placeOrder(): void {
    this.placingOrder.set(true);
    this.errorMessage.set(null);

    this.ordersService.create().subscribe({
      next: (order) => {
        this.completedOrder.set(order);
        this.placingOrder.set(false);
        this.cartService.refresh().subscribe({ error: () => {} });
      },
      error: (err) => {
        this.errorMessage.set(err.error?.error || 'Sipariş oluşturulamadı');
        this.placingOrder.set(false);
      },
    });
  }
}
