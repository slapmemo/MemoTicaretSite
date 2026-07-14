import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesService } from '../../../core/services/categories.service';
import { Category } from '../../../core/models/product.model';

@Component({
  selector: 'app-categories',
  imports: [ReactiveFormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  private readonly categoriesService = inject(CategoriesService);
  private readonly fb = inject(FormBuilder);

  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly editingId = signal<number | null>(null);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.categoriesService.list().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Kategoriler yüklenemedi');
        this.loading.set(false);
      },
    });
  }

  startEdit(category: Category): void {
    this.editingId.set(category.id);
    this.form.setValue({ name: category.name, slug: category.slug });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({ name: '', slug: '' });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.errorMessage.set(null);

    const payload = this.form.getRawValue() as { name: string; slug: string };
    const editingId = this.editingId();
    const request = editingId
      ? this.categoriesService.update(editingId, payload)
      : this.categoriesService.create(payload);

    request.subscribe({
      next: () => {
        this.cancelEdit();
        this.load();
      },
      error: (err) => this.errorMessage.set(err.error?.error || 'İşlem başarısız'),
    });
  }

  remove(category: Category): void {
    if (!confirm(`"${category.name}" silinsin mi?`)) return;
    this.categoriesService.remove(category.id).subscribe({
      next: () => this.load(),
      error: (err) => this.errorMessage.set(err.error?.error || 'Silinemedi'),
    });
  }
}
