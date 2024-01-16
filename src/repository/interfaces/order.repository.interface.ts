import { UserCart } from '../../entity/UserCart.entity';

export interface IOrderderRepository {
  create(
    user: string,
    userEmail: string,
    total: number,
    userCart: UserCart[]
  ): Promise<{
    qrcode: string;
    code: string;
    id: number | undefined;
  }>;
}
