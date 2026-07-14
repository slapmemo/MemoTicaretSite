import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../../../core/services/products.service';
import { CategoriesService } from '../../../core/services/categories.service';
import { Product, Category } from '../../../core/models/product.model';

@Component({
  selector: 'app-products',
  imports: [ReactiveFormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly fb = inject(FormBuilder);

  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly editingId = signal<number | null>(null);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    price: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    imageUrl: [''],
    categoryId: [0, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    this.categoriesService.list().subscribe((categories) => this.categories.set(categories));
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productsService.list({ limit: 100 }).subscribe({
      next: (res) => {
        this.products.set(res.items);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Ürünler yüklenemedi');
        this.loading.set(false);
      },
    });
  }

  startEdit(product: Product): void {
    this.editingId.set(product.id);
    this.form.setValue({
      name: product.name,
      description: product.description ?? '',
      price: Number(product.price),
      stock: product.stock,
      imageUrl: product.imageUrl ?? '',
      categoryId: product.categoryId,
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({ name: '', description: '', price: 0, stock: 0, imageUrl: '', categoryId: 0 });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.errorMessage.set(null);

    const raw = this.form.getRawValue();
    const payload = {
      name: raw.name!,
      description: raw.description || undefined,
      price: Number(raw.price),
      stock: Number(raw.stock),
      imageUrl: raw.imageUrl || undefined,
      categoryId: Number(raw.categoryId),
    };

    const editingId = this.editingId();
    const request = editingId
      ? this.productsService.update(editingId, payload)
      : this.productsService.create(payload);

    request.subscribe({
      next: () => {
        this.cancelEdit();
        this.loadProducts();
      },
      error: (err) => this.errorMessage.set(err.error?.error || 'İşlem başarısız'),
    });
  }

  remove(product: Product): void {
    if (!confirm(`"${product.name}" silinsin mi?`)) return;
    this.productsService.remove(product.id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => this.errorMessage.set(err.error?.error || 'Silinemedi'),
    });
  }
}
