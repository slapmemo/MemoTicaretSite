export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  imageUrl: string | null;
  categoryId: number;
  createdAt: string;
  category?: Category;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}
