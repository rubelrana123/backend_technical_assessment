import { Request, Response } from "express";
import { PaymentService } from "./payment.service";

const createPaymentIntent = async (req: Request & { user?: any }, res: Response) => {
  const { orderId } = req.body;

  const clientSecret = await PaymentService.createPaymentIntent(req.user!.id, orderId);

  res.status(200).json({
    success: true,
    clientSecret,
  });
};

const stripeWebhook = async (req: Request, res: Response) => {
  await PaymentService.handleStripeWebhook(req);
  res.status(200).send("Webhook received");
};

export const PaymentController = {
  createPaymentIntent,
  stripeWebhook,
};
