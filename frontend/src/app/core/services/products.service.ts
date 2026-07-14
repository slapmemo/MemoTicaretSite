import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductListResponse } from '../models/product.model';

export interface ProductQuery {
  search?: string;
  categoryId?: number;
  page?: number;
  limit?: number;
}

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId: number;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/products`;

  list(query: ProductQuery = {}): Observable<ProductListResponse> {
    let params = new HttpParams();
    if (query.search) params = params.set('search', query.search);
    if (query.categoryId) params = params.set('categoryId', query.categoryId);
    params = params.set('page', query.page ?? 1);
    params = params.set('limit', query.limit ?? 12);

    return this.http.get<ProductListResponse>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(input: ProductInput): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, input);
  }

  update(id: number, input: Partial<ProductInput>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, input);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
