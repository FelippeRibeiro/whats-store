import DatabaseProvider from '../database';
import { ICartRepository } from './interfaces/cart.repository.interface';
import { UserCart } from '@prisma/client';

export class CartRepository implements ICartRepository {
  private DataBaseCart = DatabaseProvider().userCart;
  async createCart(userId: string, productId: number, quantity?: number): Promise<UserCart> {
    return this.DataBaseCart.create({ data: { user: userId, productId, quantity: quantity || 1 } });
  }

  async getCartByUserId(userId: string): Promise<UserCart | null> {
    return this.DataBaseCart.findUnique({ where: { id: userId } });
  }
  async getCartByUserAndProduct(userId: string, productId: number): Promise<UserCart | null> {
    return this.DataBaseCart.findFirst({ where: { user: userId, productId } });
  }

  async updateQuantity(cartId: string, quantity: number): Promise<UserCart> {
    return this.DataBaseCart.update({ where: { id: cartId }, data: { quantity } });
  }

  async deleteCart(userId: string, productId: number): Promise<UserCart> {
    return this.DataBaseCart.delete({ where: { id: userId, productId } });
  }

  async createIfNotExistsOrUpdateQuantity(userId: string, productId: number, quantity: number): Promise<UserCart> {
    const cart = await this.getCartByUserAndProduct(userId, productId);
    if (cart) {
      return this.updateQuantity(cart.id, quantity);
    }
    return this.createCart(userId, productId, quantity);
  }
}
