import makeWASocket, { proto } from '@whiskeysockets/baileys';

export class OrderService {
  static async run(client: ReturnType<typeof makeWASocket>, message: proto.IWebMessageInfo): Promise<void> {
    //Verificar se há algo no carrinho
    //Verificar se os produtos ainda estão disponiveis
    //Calcular o valor total
    //Criar ordem e salvar no banco
    //Criar sessão e coletor
    //Coletar o email
    //Enviar pagamento
  }
}
