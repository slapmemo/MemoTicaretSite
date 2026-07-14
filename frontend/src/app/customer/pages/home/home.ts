import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../../core/services/products.service';
import { CategoriesService } from '../../../core/services/categories.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product, Category } from '../../../core/models/product.model';

@Component({
  selector: 'app-home',
  imports: [FormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly cartService = inject(CartService);
  private readonly auth = inject(AuthService);

  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly limit = 12;
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly addedMessage = signal<string | null>(null);

  search = '';
  selectedCategoryId: number | null = null;

  constructor() {
    this.categoriesService.list().subscribe((categories) => this.categories.set(categories));
    this.load();
  }

  get totalPages(): number {
    return Math.max(Math.ceil(this.total() / this.limit), 1);
  }

  load(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.productsService
      .list({
        search: this.search || undefined,
        categoryId: this.selectedCategoryId ?? undefined,
        page: this.page(),
        limit: this.limit,
      })
      .subscribe({
        next: (res) => {
          this.products.set(res.items);
          this.total.set(res.total);
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set('Ürünler yüklenemedi');
          this.loading.set(false);
        },
      });
  }

  applyFilters(): void {
    this.page.set(1);
    this.load();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.page.set(page);
    this.load();
  }

  addToCart(product: Product): void {
    if (!this.auth.isLoggedIn()) {
      this.errorMessage.set('Sepete eklemek için giriş yapmalısınız');
      return;
    }
    this.cartService.addItem(product.id, 1).subscribe({
      next: () => {
        this.addedMessage.set(`"${product.name}" sepete eklendi`);
        setTimeout(() => this.addedMessage.set(null), 2000);
      },
      error: () => this.errorMessage.set('Sepete eklenemedi'),
    });
  }
}
