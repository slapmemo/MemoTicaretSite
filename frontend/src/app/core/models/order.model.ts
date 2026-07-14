import { Product } from './product.model';

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: string;
  product?: Product;
}

export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  total: string;
  createdAt: string;
  items: OrderItem[];
  user?: { id: number; name: string; email: string };
}
