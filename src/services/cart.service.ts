import makeWASocket, { proto } from '@whiskeysockets/baileys';
import { getTextContent } from '../utils/getMessagesContents';
import { CartRepository } from '../repository/cart.repository';

export class CartService {
  private static CartRepository = new CartRepository();
  static async run(client: ReturnType<typeof makeWASocket>, message: proto.IWebMessageInfo): Promise<void> {
    const [_, id, quantity] = getTextContent(message)!.split(' ');
    try {
      const cart = await this.CartRepository.createIfNotExistsOrUpdateQuantity(message.key.remoteJid!, Number(id), Number(quantity));
      await client.sendMessage(message.key.remoteJid!, {
        text: `Item adicionado ao carrinho!\n\nCaso queria atualizar a quantidade digite: /adicionar ${id} ${cart.quantity}`,
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
    }
  }
}
