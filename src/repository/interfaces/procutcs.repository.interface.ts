import { Products } from '@prisma/client';

export interface IProductsRepository {
  getProducts(): Promise<Products[]>;
  getAvaliableProducts(): Promise<Products[]>;
  // getProductById(id: string): Promise<Products>;
}
