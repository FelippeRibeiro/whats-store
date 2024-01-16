import makeWASocket, { proto } from '@whiskeysockets/baileys';
import { CartRepository } from '../repository/cart.repository';
import { reply } from '../index';
import { ProductsRepository } from '../repository/products.repository';
import { sessions } from '../utils/sessions/sessions';
import { OrderSession } from '../utils/sessions/OrderSession';

export class OrderService {
  private static CartRepository = new CartRepository();
  private static ProductsRepository = new ProductsRepository();

  static async run(client: ReturnType<typeof makeWASocket>, message: proto.IWebMessageInfo): Promise<void> {
    const userCart = await this.CartRepository.getCartByUserId(message.key.remoteJid!);

    if (!userCart.length) {
      await reply({ text: 'Seu carrinho está vazio' }, message);
      return;
    }

    const removedItems = [];
    for (const cartItem of userCart) {
      if (cartItem.product.amount < cartItem.quantity) {
        await this.CartRepository.updateQuantity(cartItem.id, 0);
        removedItems.push(cartItem.product.title);
      }
    }

    if (removedItems.length) {
      await reply(
        {
          text: `Os itens a seguir foram removidos do seu carrinho:\n\n${removedItems.map(
            (item) => `- *${item}*\n`
          )}\nVerifique a disponibilidade e quantidade novamente!`,
        },
        message
      );
      return;
    }

    const total = Number(userCart.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2));

    await client.sendMessage(message.key.remoteJid!, {
      text: `Seu pedido:${userCart.map(
        (itemCart) => `\n- ${itemCart.product.title} ${itemCart.quantity} R$ ${itemCart.product.price}`
      )}\n\nValor total: ${total}\n\nPara confirmar e seguir para o pagamento digite seu *email*\nPara cancelar envie *cancelar* a qualquer momento!`,
    });

    sessions.set(message.key.remoteJid!, {
      lastChoice: [],
      subMenu: new OrderSession(Number(total.toFixed(2)), message.key.remoteJid!),
      time: new Date().toString(),
    });

    //Criar ordem e salvar no banco
    //Criar sessão e coletor
    //Coletar o email
    //Enviar pagamento
  }
}
