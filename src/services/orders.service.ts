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

    //Verificar se os produtos ainda estão disponiveis

    //Calcular o valor total
    //Criar ordem e salvar no banco
    //Criar sessão e coletor
    //Coletar o email
    //Enviar pagamento
  }
}
