import makeWASocket, { DisconnectReason, useMultiFileAuthState, Browsers, proto, AnyMessageContent } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { messageUpserts } from './controller/messages.upsert';
import pino from 'pino';

let client: ReturnType<typeof makeWASocket>;
async function connectToWhatsApp() {
  const { saveCreds, state } = await useMultiFileAuthState('auth');

  client = makeWASocket({
    printQRInTerminal: true,
    browser: Browsers.appropriate('Chrome'),
    auth: state,
    logger: pino({ level: 'silent' }) as any,
  });

  client.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    console.log('Connection Update', connection, lastDisconnect);

    if (connection === 'open') {
      console.log('Conectado!');
    }
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
      if (shouldReconnect) {
        connectToWhatsApp();
      }
    }
  });

  client.ev.on('messages.upsert', (update) => messageUpserts(update, client));

  client.ev.on('creds.update', saveCreds);
  return client;
}

export const reply = async (content: AnyMessageContent, msg: proto.IWebMessageInfo) =>
  await client.sendMessage(msg.key.remoteJid!, content, { quoted: msg });

connectToWhatsApp();
