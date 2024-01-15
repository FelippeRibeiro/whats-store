import { Product } from './Product.entity';

export interface UserCart {
  id: string;
  user: string;
  quantity: number;
  addedAt: Date;

  product: Product;
  productId: number;
}
