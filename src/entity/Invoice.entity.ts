import { Order } from './Order.entity';

export interface Invoice {
  id: string;
  order: Order;
  orderId: string;
  total: number;
  externalReference: string;
  mercadoPagoId: string;
  status: string;
}
