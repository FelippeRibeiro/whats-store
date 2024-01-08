import { UserCart } from '@prisma/client';

export interface ICartRepository {
  getCartByUserId(userId: string): Promise<UserCart | null>;
  createCart(userId: string, productId: number, quantity: number): Promise<UserCart>;
}
