import { UserCart } from '@prisma/client';

export interface ICartRepository {
  getCartByUserId(userId: string): Promise<UserCart | null>;
  createCart(userId: string, productId: number, quantity: number): Promise<UserCart>;
  getCartByUserAndProduct(userId: string, productId: number): Promise<UserCart | null>;
  updateQuantity(cartId: string, quantity: number): Promise<UserCart>;
  deleteCart(userId: string, productId: number): Promise<UserCart>;
  createIfNotExistsOrUpdateQuantity(userId: string, productId: number, quantity: number): Promise<UserCart>;
}
