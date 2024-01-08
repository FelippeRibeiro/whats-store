import makeWASocket, { proto } from '@whiskeysockets/baileys';

export const reply = async (text: string, msg: proto.IWebMessageInfo, client: ReturnType<typeof makeWASocket>) =>
  await client.sendMessage(msg.key.remoteJid!, { text }, { quoted: msg });
