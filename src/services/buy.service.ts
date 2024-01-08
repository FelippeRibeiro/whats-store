import makeWASocket, { proto } from '@whiskeysockets/baileys';

export class BuyService {
  static run(client: ReturnType<typeof makeWASocket>, message: proto.IWebMessageInfo): void {}
}
