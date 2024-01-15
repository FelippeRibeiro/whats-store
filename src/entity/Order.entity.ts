import { Invoice } from './Invoice.entity';
import { OrderItems } from './OrderItems.entity';

export interface Order {
  id: string;
  total: number;
  userId: string;
  userEmail: string;
  createdAt: Date;
  paidAt?: Date;
  Invoice: Invoice[];
  OrderItems: OrderItems[];
}
