import { Order } from './Order.entity';
import { Product } from './Product.entity';

export interface OrderItems {
  id: string;
  order: Order;
  product: Product;
  quantity: number;
  createdAt: Date;
  orderId: string;
  productId: number;
}
