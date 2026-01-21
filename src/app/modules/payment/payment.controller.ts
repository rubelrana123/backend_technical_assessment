import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PaymentService } from "./payment.service";
import httpStatus from "http-status";

const createPaymentIntent = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { orderId } = req.body;

  const clientSecret = await PaymentService.createPaymentIntent(req.user!.id, orderId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment intent created successfully",
    data: { clientSecret },
  });
});

const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
  await PaymentService.handleStripeWebhook(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Webhook received",
    data: null,
  });
});

export const PaymentController = {
  createPaymentIntent,
  stripeWebhook,
};
