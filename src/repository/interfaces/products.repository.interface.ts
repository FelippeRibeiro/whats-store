import { Products } from '@prisma/client';

export interface IProductsRepository {
  getProducts(): Promise<Products[]>;
  getAvaliableProducts(): Promise<Products[]>;
  decrementAmount(productId: number, quantity: number): Promise<any>;
  // getProductById(id: string): Promise<Products>;
}
