import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/orders`;

  create(): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, {});
  }

  listMine(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }
}
