import { IProductsRepository } from './interfaces/procutcs.repository.interface';
import { Products } from '@prisma/client';
import DatabaseProvider from '../database';

export class ProductsRepository implements IProductsRepository {
  private DataBaseProducts = DatabaseProvider().products;
  async getProducts(): Promise<Products[]> {
    return this.DataBaseProducts.findMany();
  }

  async getAvaliableProducts(): Promise<Products[]> {
    return this.DataBaseProducts.findMany({ where: { amount: { gt: 0 } } });
  }
}
