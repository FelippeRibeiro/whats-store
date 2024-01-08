import makeWASocket, { proto } from '@whiskeysockets/baileys';
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
          caption: `Id: *${product.id}*\nNome: *${product.title}*\n\nDescrição: *${product.description}*\n\nValor: *${product.price} R$*\n\nQuantidade: *${product.amount}*`,
          image: product.image,
        },
        { quoted: message }
      );
      continue;
    }

    await client.sendMessage(message.key.remoteJid!, {
      text: 'Digite o *id* do produto e a *quantidade* que deseja adicionar ao carrinho: \nExemplo: ```/adicionar 1 5```',
    });
  }
}
