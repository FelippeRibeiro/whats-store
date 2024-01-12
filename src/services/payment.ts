import { MercadoPagoConfig, Payment } from 'mercadopago';
import 'dotenv/config';

export class PaymentService extends MercadoPagoConfig {
  paymentClient = new Payment(this);
  constructor() {
    super({ accessToken: process.env.MERCADOPAGO_ACESSTOKEN as string });
  }

  public async createPayment(total: number, description: string, email: string) {
    const paymentData = await this.paymentClient.create({
      body: {
        description,
        transaction_amount: total,
        payment_method_id: 'pix',
        payer: {
          email,
        },
      },
    });
    const qrcode = paymentData.point_of_interaction?.transaction_data?.qr_code_base64;
    const code = paymentData.point_of_interaction?.transaction_data?.qr_code;
    if (!qrcode || !code) throw new Error('Ocorreu um erro ao gerar o pedido!');

    return {
      qrcode,
      code,
      id: paymentData.id,
    };
  }
}
