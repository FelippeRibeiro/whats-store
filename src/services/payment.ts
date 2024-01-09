import { MercadoPagoConfig, Payment } from 'mercadopago';
import { CreatePaymentPayload } from 'mercadopago/models/payment/create-payload.model';
import 'dotenv/config';

export class PaymentService extends MercadoPagoConfig {
  paymentClient = new Payment(this);
  constructor() {
    super({ accessToken: process.env.MERCADOPAGO_ACESSTOKEN as string });
  }

  public async createPayment(total: number, description: string) {
    this.paymentClient.create({
      body: {
        description,
        transaction_amount: total,
        payment_method_id: 'pix',
      },
    });
  }
}
