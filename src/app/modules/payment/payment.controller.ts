import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PaymentService } from "./payment.service";
import httpStatus from "http-status";
import { stripe } from "../../helper/stripe";

const createPaymentIntent = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { orderId } = req.body;

  const clientSecret = await PaymentService.createPaymentIntent(req.user!, orderId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment intent created successfully",
    data: { clientSecret },
  });
});
 
const stripeWebhook = catchAsync(async (req: Request, res: Response) => {

    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
        console.error("⚠️ Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    const result = await PaymentService.stripeWebhook(event);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Webhook req send successfully',
        data: result,
    });
});

 

export const PaymentController = {
  createPaymentIntent,
  stripeWebhook,
};
