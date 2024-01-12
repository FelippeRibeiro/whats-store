import makeWASocket, { proto } from '@whiskeysockets/baileys';

type Client = ReturnType<typeof makeWASocket>;
type Message = proto.IWebMessageInfo;
// export interface SubMenus {
//   step: number;
//   continue: (msg: msg) => void;
//   nextStep: (msg: msg) => void;
//   previousStep: (msg: msg) => void;
//   callStep: (msg: msg, step: number) => void;
// }

export class SubMenus {
  step = 0;

  response = false;

  async continue(msg: Message) {}

  callStep(msg: Message, step: number) {
    this.response = false;
    this.step = step;
    this.continue(msg);
  }
  nextStep(msg: Message) {
    this.step++;
    this.response = false;
    this.continue(msg);
  }
  previousStep(msg: Message) {
    this.step--;
    this.response = false;
    this.continue(msg);
  }
}
