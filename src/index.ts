import makeWASocket, { DisconnectReason, useMultiFileAuthState, Browsers, proto } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { messageUpserts } from './controller/messages.upsert';

let client: ReturnType<typeof makeWASocket>;
async function connectToWhatsApp() {
  const { saveCreds, state } = await useMultiFileAuthState('auth');

  client = makeWASocket({
    printQRInTerminal: true,
    browser: Browsers.appropriate('Chrome'),
    auth: state,
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
connectToWhatsApp();
