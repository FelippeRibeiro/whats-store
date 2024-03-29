import { proto } from '@whiskeysockets/baileys';
import { SubMenus } from './types/SubMenus';
import { getTextContent } from '../getMessagesContents';
import { reply } from '../..';
import { PaymentService } from '../../services/payment';
import { sessions } from './sessions';
import { CartRepository } from '../../repository/cart.repository';
import { UserCart } from '../../entity/UserCart.entity';
import { OrderRepository } from '../../repository/order.repostory';

export class OrderSession extends SubMenus {
  datas: { email: string; total: number; user: string; userCart: UserCart[] };
  response = true;

  constructor(total: number, user: string, userCart: UserCart[]) {
    super();
    this.datas = { email: '', total, user, userCart };
  }

  async continue(msg: proto.IWebMessageInfo): Promise<void> {
    switch (this.step) {
      case 0:
        if (this.datas.email) return this.nextStep(msg);
        const email = getTextContent(msg);
        if (!email || !email.includes('@')) {
          await reply({ text: 'Insira um email valido!' }, msg);
          return;
        }
        this.datas.email = email;
        this.nextStep(msg);

        break;
      case 1:
        sessions.delete(this.datas.user);
        const payment = await new OrderRepository().create(this.datas.user, this.datas.email, this.datas.total, this.datas.userCart);
        await reply({ text: `Seu pedido foi gerado!\nValor total R$ ${this.datas.total}\nSegue codigo copia e cola` }, msg);
        const qrcode = await reply({ image: Buffer.from(payment.qrcode, 'base64') }, msg);
        await reply({ text: payment.code }, qrcode!);
        break;
    }
  }
}
