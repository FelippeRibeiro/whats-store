import { proto } from '@whiskeysockets/baileys';
import { SubMenus } from './types/SubMenus';
import { getTextContent } from '../getMessagesContents';
import { reply } from '../..';

export class OrderSession extends SubMenus {
  datas = { email: '' };
  response = true;

  async continue(msg: proto.IWebMessageInfo): Promise<void> {
    switch (this.step) {
      case 0:
        if (this.datas.email) return this.nextStep(msg);
        const email = getTextContent(msg);
        if (!email || !email.includes('@')) {
          await reply('Insira um email valido!', msg);
          return;
        }
        this.datas.email = email;
        this.nextStep(msg);

        break;
      case 1:
        await reply('Seu email é ' + this.datas.email, msg);
        break;
    }
  }
}
