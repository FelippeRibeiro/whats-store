import { OrderItems } from './OrderItems.entity';
import { UserCart } from './UserCart.entity';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  amount: number;
  image: Buffer;
  UserCart: UserCart[];
  OrderItems: OrderItems[];
}
