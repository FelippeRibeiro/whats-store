import DatabaseProvider from '../database';
import { ICartRepository } from './interfaces/cart.repository.interface';
import { Prisma, UserCart } from '@prisma/client';

export class CartRepository implements ICartRepository {
  private DataBaseCart = DatabaseProvider().userCart;
  private DataBaseProducts = DatabaseProvider().products;
  async createCart(userId: string, productId: number, quantity?: number): Promise<UserCart> {
    const product = await this.DataBaseProducts.findUnique({ where: { id: productId } });
    if (!product) throw new Error('O item adicionado não existe!');
    if (product.amount < (quantity || 1)) throw new Error('Desculpe, o estoque do item solicitado não esta mais disponível ou quantidade invalida!');
    return this.DataBaseCart.create({ data: { user: userId, productId, quantity: quantity || 1 } });
  }

  async getCartByUserId(userId: string) {
    return this.DataBaseCart.findMany({ where: { user: userId }, include: { product: true } });
  }
  async getCartByUserAndProduct(userId: string, productId: number): Promise<UserCart | null> {
    return this.DataBaseCart.findFirst({ where: { user: userId, productId } });
  }

  async updateQuantity(cartId: string, quantity: number): Promise<UserCart> {
    if (quantity && quantity < 0) throw new Error('Adicione um valor valido para atualizar a quantidade no carrinho!');
    if (quantity == 0) return this.deleteCart(cartId);
    return this.DataBaseCart.update({ where: { id: cartId }, data: { quantity } });
  }

  async deleteCart(cartId: string): Promise<UserCart> {
    return this.DataBaseCart.delete({ where: { id: cartId } });
  }

  async deleteUserCart(userId: string): Promise<any> {
    return this.DataBaseCart.deleteMany({ where: { user: userId } });
  }

  async createIfNotExistsOrUpdateQuantity(userId: string, productId: number, quantity: number): Promise<UserCart> {
    const cart = await this.getCartByUserAndProduct(userId, productId);
    if (cart) {
      const product = await this.DataBaseProducts.findUnique({ where: { id: productId } });
      if (!product) {
        await this.deleteCart(cart.id);
        throw new Error('O item adicionado não existe ou não esta mais disponível!');
      }
      if (product && product?.amount < quantity) throw new Error('Desculpe, a quantidade do item solicitado não esta mais disponível');

      return this.updateQuantity(cart.id, quantity);
    }
    return this.createCart(userId, productId, quantity);
  }
}
