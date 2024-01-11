import makeWASocket, { proto } from '@whiskeysockets/baileys';
import { CartRepository } from '../repository/cart.repository';
import { reply } from '../utils/reply';
import { ProductsRepository } from '../repository/products.repository';

export class OrderService {
  private static CartRepository = new CartRepository();
  private static ProductsRepository = new ProductsRepository();

  static async run(client: ReturnType<typeof makeWASocket>, message: proto.IWebMessageInfo): Promise<void> {
    const cart = await this.CartRepository.getCartByUserId(message.key.remoteJid!);

    if (!cart.length) {
      await reply('Seu carrinho está vazio', message, client);
      return;
    }

    const removedItems = [];
    for (const cartItem of cart) {
      if (cartItem.product.amount < cartItem.quantity) {
        await this.CartRepository.updateQuantity(cartItem.id, 0);
        removedItems.push(cartItem.product.title);
      }
    }

    if (removedItems.length) {
      await reply(
        `Os itens a seguir foram removidos do seu carrinho:\n\n${removedItems.map(
          (item) => `- *${item}*\n`
        )}\nVerifique a disponibilidade e quantidade novamente!`,
        message,
        client
      );
      return;
    }

    const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    //Criar ordem e salvar no banco
    //Criar sessão e coletor
    //Coletar o email
    //Enviar pagamento
  }
}
