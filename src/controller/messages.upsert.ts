import makeWASocket, { MessageUpsertType, proto } from '@whiskeysockets/baileys';
import { contacts } from '../utils/contacts';
import { getTextContent } from '../utils/getMessagesContents';
import { ListService } from '../services/list.service';

export async function messageUpserts(
  update: { messages: proto.IWebMessageInfo[]; type: MessageUpsertType },
  client: ReturnType<typeof makeWASocket>
) {
  const msg: proto.IWebMessageInfo = update.messages[0];
  if (!msg.message) return;
  if (msg.key.fromMe) return;
  if (msg.key.remoteJid === 'status@broadcast' || msg.key.remoteJid?.includes('@g.us')) return;
  const messageType = Object.keys(msg.message)[0];
  const from: string = String(msg.key.remoteJid);

  if (msg.key.remoteJid !== contacts.ownerJid) return;

  const messageContent = getTextContent(msg);
  if (!messageContent || !messageContent.startsWith('/')) return;

  console.log(msg.message.extendedTextMessage?.contextInfo?.quotedMessage);

  console.log(getTextContent(msg));

  switch (messageContent) {
    case '/produtos':
      ListService.run(client, msg);
      break;
  }
}
