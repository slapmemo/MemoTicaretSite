import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category } from '../models/product.model';

export interface CategoryInput {
  name: string;
  slug: string;
}

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/categories`;

  list(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  create(input: CategoryInput): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, input);
  }

  update(id: number, input: Partial<CategoryInput>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, input);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
