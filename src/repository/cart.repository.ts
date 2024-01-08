import DatabaseProvider from '../database';
import { ICartRepository } from './interfaces/cart.repository.interface';
import { UserCart } from '@prisma/client';

export class CartRepository implements ICartRepository {
  private DataBaseCart = DatabaseProvider().userCart;
  async createCart(userId: string, productId: number): Promise<UserCart> {
    return this.DataBaseCart.create({ data: { user: userId, productId, quantity: 1 } });
  }

  async getCartByUserId(userId: string): Promise<UserCart | null> {
    return this.DataBaseCart.findUnique({ where: { id: userId } });
  }
}
