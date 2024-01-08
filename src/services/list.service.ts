import { Boom } from '@hapi/boom';
import makeWASocket, { proto } from '@whiskeysockets/baileys';
import { ExistsResponse, RegistrationOptions } from '@whiskeysockets/baileys/lib/Socket/registration';
import { ProductsRepository } from '../repository/products.repository';

export class ListService {
  private static productsRepository = new ProductsRepository();
  static async run(client: ReturnType<typeof makeWASocket>, message: proto.IWebMessageInfo): Promise<void> {
    const avaliableProducts = await this.productsRepository.getAvaliableProducts();

    if (avaliableProducts.length === 0) {
      client.sendMessage(message.key.remoteJid!, { text: 'Nenhum produto disponível! 😔' });
      return;
    }

    await client.sendMessage(
      message.key.remoteJid!,
      {
        text: 'Produtos disponíveis:',
      },
      { quoted: message }
    );

    for (const product of avaliableProducts) {
      await client.sendMessage(
        message.key.remoteJid!,
        {
          caption: `Nome: *${product.title}*\n\nDescrição: *${product.description}*\n\nValor: *${product.price} R$*`,
          image: product.image,
        },
        { quoted: message }
      );
      continue;
    }
  }
}
