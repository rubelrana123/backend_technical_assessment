import Stripe from "stripe";
import { prisma } from "../../shared/prisma";
import { PaymentStatus, OrderStatus } from "@prisma/client";
import { stripe } from "../../helper/stripe";
 
/**
 * Create Stripe Payment Intent for an order
 */
const createPaymentIntent = async (userId: string, orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order || order.userId !== userId) {
    throw new Error("Order not found or unauthorized");
  }

  if (order.items.length === 0) {
    throw new Error("Order is empty");
  }

  const amount = order.totalAmount;

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd", // or your currency
    metadata: {
      orderId: order.id,
      userId,
    },
  });

  // Save payment record in DB with PENDING status
  await prisma.payment.create({
    data: {
      userId,
      orderId: order.id,
      amount,
      transactionId: paymentIntent.id,
      status: PaymentStatus.PENDING,
    },
  });

  return paymentIntent.client_secret;
};

/**
 * Handle Stripe Webhook
 */
const handleStripeWebhook = async (req: any) => {
  const sig = req.headers["stripe-signature"];
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.log("Webhook signature verification failed.", err);
    throw new Error("Webhook Error");
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      // Update Payment and Order status
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { transactionId: paymentIntent.id },
          data: { status: PaymentStatus.PAID },
        });

        const orderId = paymentIntent.metadata.orderId;
        await tx.order.update({
          where: { id: orderId },
          data: { status: OrderStatus.CONFIRMED },
        });
      });

      break;

    case "payment_intent.payment_failed":
      const failedIntent = event.data.object as Stripe.PaymentIntent;
      await prisma.payment.update({
        where: { transactionId: failedIntent.id },
        data: { status: PaymentStatus.FAILED },
      });
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};

export const PaymentService = {
  createPaymentIntent,
  handleStripeWebhook,
};
