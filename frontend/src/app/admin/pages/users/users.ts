import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-users',
  imports: [DatePipe],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  private readonly adminService = inject(AdminService);

  readonly users = signal<User[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.adminService.listUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Kullanıcılar yüklenemedi');
        this.loading.set(false);
      },
    });
  }
}
