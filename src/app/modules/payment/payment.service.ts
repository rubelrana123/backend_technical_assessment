import Stripe from "stripe";
import { prisma } from "../../shared/prisma";
import { PaymentStatus, OrderStatus } from "@prisma/client";
import { stripe } from "../../helper/stripe";
 
/**
 * Create Stripe Payment Intent for an order
 */
const createPaymentIntent = async (user: any, orderId: string) => {
  const userId = (await prisma.user.findUniqueOrThrow({
    where: { email: user.email },
  })).id;
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

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: `Order ${order.id}`,
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      orderId: order.id,
      userId,
    },
    success_url: `https://www.rubelrana.success/`,
    cancel_url: `https://rubelrana/failed`,
  });

  // Save payment record in DB with PENDING status
  await prisma.payment.create({
    data: {
      userId,
      orderId: order.id,
      amount,
      transactionId: session.id,
      status: PaymentStatus.PENDING,
    },
  });

  return { paymentUrl: session.url };
};

/**
 * Handle Stripe Webhook
 */
const stripeWebhook = async (req: any) => {
  const sig = req.headers["stripe-signature"];

  console.log("sig, body", sig, req.body);
  if (!sig) {
    throw new Error("Missing Stripe-Signature header");
  }

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
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      if (!orderId) {
        throw new Error("Missing orderId in payment metadata");
      }

      // Update Payment and Order status
      await prisma.$transaction(async (tx) => {
        const payment = await tx.payment.findUnique({
          where: { transactionId: session.id },
        });
        if (payment && payment.status !== PaymentStatus.PAID) {
          await tx.payment.update({
            where: { transactionId: session.id },
            data: { status: PaymentStatus.PAID },
          });
        }

        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });
        if (!order) {
          throw new Error("Order not found");
        }
        if (order.status !== OrderStatus.CONFIRMED) {
          await tx.order.update({
            where: { id: orderId },
            data: { status: OrderStatus.CONFIRMED },
          });
          for (const item of order.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: { decrement: item.quantity },
              },
            });
          }
        }
      });

      break;
    }

    case "checkout.session.async_payment_failed":
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      await prisma.payment.update({
        where: { transactionId: session.id },
        data: { status: PaymentStatus.FAILED },
      });
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};

export const PaymentService = {
  createPaymentIntent,
  stripeWebhook,
};
