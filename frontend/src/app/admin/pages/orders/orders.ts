import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { Order, OrderStatus } from '../../../core/models/order.model';

const ORDER_STATUSES: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

@Component({
  selector: 'app-admin-orders',
  imports: [FormsModule, DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class AdminOrders {
  private readonly adminService = inject(AdminService);

  readonly orders = signal<Order[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly statuses = ORDER_STATUSES;

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.adminService.listOrders().subscribe({
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

  changeStatus(order: Order, status: OrderStatus): void {
    this.adminService.updateOrderStatus(order.id, status).subscribe({
      next: () => this.load(),
      error: (err) => this.errorMessage.set(err.error?.error || 'Durum güncellenemedi'),
    });
  }
}
