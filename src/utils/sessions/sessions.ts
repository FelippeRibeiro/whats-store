import makeWASocket, { proto } from '@whiskeysockets/baileys';
import { getTextContent } from '../getMessagesContents';
import { reply } from '../../index';
import { SubMenus } from './types/SubMenus';

export const sessions = new Map<string, { lastChoice: string[]; time: string; subMenu: SubMenus | null }>();

export async function handleSessions(client: ReturnType<typeof makeWASocket>, message: proto.IWebMessageInfo) {
  const session = sessions.get(message.key.remoteJid!);
  if (!session) return;

  const messageText = getTextContent(message);

  if (session && messageText === 'cancelar') {
    sessions.delete(message.key.remoteJid!);
    await reply('Sessão finalizada!', message);
    return;
  }

  if (session.subMenu) return session.subMenu.continue(message);
}
