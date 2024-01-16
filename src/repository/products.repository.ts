import { IProductsRepository } from './interfaces/products.repository.interface';
import { Products } from '@prisma/client';
import DatabaseProvider from '../database';

export class ProductsRepository implements IProductsRepository {
  private databaseProducts = DatabaseProvider().products;
  async getProducts(): Promise<Products[]> {
    return this.databaseProducts.findMany();
  }

  async getAvaliableProducts(): Promise<Products[]> {
    return this.databaseProducts.findMany({ where: { amount: { gt: 0 } } });
  }
}
