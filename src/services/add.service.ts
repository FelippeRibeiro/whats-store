import makeWASocket, { proto } from '@whiskeysockets/baileys';

export class AddService {
  static run(client: ReturnType<typeof makeWASocket>, message: proto.IWebMessageInfo): void {
    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  }
}
