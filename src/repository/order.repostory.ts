import DatabaseProvider from '../database';
import { UserCart } from '../entity/UserCart.entity';
import { PaymentService } from '../services/payment';
import { CartRepository } from './cart.repository';
import { IOrderderRepository } from './interfaces/order.repository.interface';
import { ProductsRepository } from './products.repository';

export class OrderRepository implements IOrderderRepository {
  private databaseOrder = DatabaseProvider().order;
  private databaseOrderItems = DatabaseProvider().orderItems;
  private databaseInvoice = DatabaseProvider().invoice;
  private cartRepository = new CartRepository();
  private productsRepository = new ProductsRepository();
  async create(user: string, userEmail: string, total: number, userCart: UserCart[]): Promise<any> {
    const order = await this.databaseOrder.create({ data: { total, userEmail, userId: user } });

    for (const cartItem of userCart) {
      await this.databaseOrderItems.create({ data: { quantity: cartItem.quantity, orderId: order.id, productId: cartItem.productId } });
      await this.productsRepository.decrementAmount(cartItem.productId, cartItem.quantity);
    }

    const payment = await new PaymentService().createPayment(total, 'Pedido', userEmail);

    await this.databaseInvoice.create({
      data: {
        externalReference: order.id,
        total,
        orderId: order.id,
        mercadoPagoId: String(payment.id),
      },
    });
    await this.cartRepository.deleteUserCart(user);

    return payment;
  }
}
