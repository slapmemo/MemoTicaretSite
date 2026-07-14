import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '../../../core/services/products.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { ReviewsService } from '../../../core/services/reviews.service';
import { Product } from '../../../core/models/product.model';
import { Review } from '../../../core/models/review.model';

@Component({
  selector: 'app-product-detail',
  imports: [FormsModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly reviewsService = inject(ReviewsService);
  readonly auth = inject(AuthService);

  private readonly productId = Number(this.route.snapshot.paramMap.get('id'));

  readonly product = signal<Product | null>(null);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly addedMessage = signal<string | null>(null);

  readonly reviews = signal<Review[]>([]);
  readonly reviewsLoading = signal(true);
  readonly reviewError = signal<string | null>(null);
  readonly submittingReview = signal(false);

  quantity = 1;
  reviewRating = 5;
  reviewComment = '';

  constructor() {
    this.productsService.getById(this.productId).subscribe({
      next: (product) => {
        this.product.set(product);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Ürün bulunamadı');
        this.loading.set(false);
      },
    });

    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewsLoading.set(true);
    this.reviewsService.list(this.productId).subscribe({
      next: (reviews) => {
        this.reviews.set(reviews);
        this.reviewsLoading.set(false);
      },
      error: () => {
        this.reviewError.set('Yorumlar yüklenemedi');
        this.reviewsLoading.set(false);
      },
    });
  }

  addToCart(): void {
    const product = this.product();
    if (!product) return;

    if (!this.auth.isLoggedIn()) {
      this.errorMessage.set('Sepete eklemek için giriş yapmalısınız');
      return;
    }

    this.cartService.addItem(product.id, this.quantity).subscribe({
      next: () => this.addedMessage.set('Sepete eklendi'),
      error: () => this.errorMessage.set('Sepete eklenemedi'),
    });
  }

  submitReview(): void {
    this.submittingReview.set(true);
    this.reviewError.set(null);

    this.reviewsService.create(this.productId, this.reviewRating, this.reviewComment || undefined).subscribe({
      next: () => {
        this.reviewComment = '';
        this.reviewRating = 5;
        this.submittingReview.set(false);
        this.loadReviews();
      },
      error: (err) => {
        this.reviewError.set(err.error?.error || 'Yorum gönderilemedi');
        this.submittingReview.set(false);
      },
    });
  }
}
