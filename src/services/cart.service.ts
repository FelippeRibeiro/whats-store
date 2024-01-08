import makeWASocket, { proto } from '@whiskeysockets/baileys';
import { getTextContent } from '../utils/getMessagesContents';
import { CartRepository } from '../repository/cart.repository';
import { ProductsRepository } from '../repository/products.repository';

export class CartService {
  private static CartRepository = new CartRepository();
  private static ProductsRepository = new ProductsRepository();
  static async run(client: ReturnType<typeof makeWASocket>, message: proto.IWebMessageInfo): Promise<void> {
    const [_, id, quantity] = getTextContent(message)!.split(' ');

    try {
      const cart = await this.CartRepository.createIfNotExistsOrUpdateQuantity(message.key.remoteJid!, Number(id), Number(quantity));
      await client.sendMessage(message.key.remoteJid!, {
        text: `Carrinho atualizado!\n\nCaso queria atualizar a quantidade digite: /adicionar ${id} ${cart.quantity++}`,
      });
    } catch (error) {
      await client.sendMessage(message.key.remoteJid!, { text: (error as Error).message });
    }
  }

  static async getCart(client: ReturnType<typeof makeWASocket>, message: proto.IWebMessageInfo): Promise<void> {
    const cart = await this.CartRepository.getCartByUserId(message.key.remoteJid!);
    if (!cart.length) {
      await client.sendMessage(message.key.remoteJid!, { text: 'Carrinho vazio! 😔' });
      return;
    } else {
      const products = await this.ProductsRepository.getAvaliableProducts();

      const resume = cart.map((item) => {
        return {
          item: products.find((product) => product.id === item.productId)?.title,
          quantity: item.quantity,
          value: item.quantity * (products.find((product) => product.id === item.productId)?.price || 0),
        };
      });

      const total = resume.reduce((acc, item) => acc + item.value, 0);

      await client.sendMessage(message.key.remoteJid!, {
        text: `Produtos no carrinho: \n\n${resume
          .map((item) => `${item.quantity} - ${item.item} - R$ ${item.value}`)
          .join('\n')}\n\nTotal: R$ ${total}`,
      });
    }
  }
}
