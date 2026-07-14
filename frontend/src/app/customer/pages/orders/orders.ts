import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { OrdersService } from '../../../core/services/orders.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-orders',
  imports: [DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  private readonly ordersService = inject(OrdersService);

  readonly orders = signal<Order[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.ordersService.listMine().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Siparişler yüklenemedi');
        this.loading.set(false);
      },
    });
  }
}
