"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const prisma_1 = require("../../shared/prisma");
const client_1 = require("@prisma/client");
const stripe_1 = require("../../helper/stripe");
/**
 * Create Stripe Payment Intent for an order
 */
const createPaymentIntent = (userId, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield prisma_1.prisma.order.findUnique({
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
    const paymentIntent = yield stripe_1.stripe.paymentIntents.create({
        amount,
        currency: "usd", // or your currency
        metadata: {
            orderId: order.id,
            userId,
        },
    });
    // Save payment record in DB with PENDING status
    yield prisma_1.prisma.payment.create({
        data: {
            userId,
            orderId: order.id,
            amount,
            transactionId: paymentIntent.id,
            status: client_1.PaymentStatus.PENDING,
        },
    });
    return paymentIntent.client_secret;
});
/**
 * Handle Stripe Webhook
 */
const handleStripeWebhook = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = stripe_1.stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        console.log("Webhook signature verification failed.", err);
        throw new Error("Webhook Error");
    }
    switch (event.type) {
        case "payment_intent.succeeded":
            const paymentIntent = event.data.object;
            // Update Payment and Order status
            yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                yield tx.payment.update({
                    where: { transactionId: paymentIntent.id },
                    data: { status: client_1.PaymentStatus.PAID },
                });
                const orderId = paymentIntent.metadata.orderId;
                yield tx.order.update({
                    where: { id: orderId },
                    data: { status: client_1.OrderStatus.CONFIRMED },
                });
            }));
            break;
        case "payment_intent.payment_failed":
            const failedIntent = event.data.object;
            yield prisma_1.prisma.payment.update({
                where: { transactionId: failedIntent.id },
                data: { status: client_1.PaymentStatus.FAILED },
            });
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
});
exports.PaymentService = {
    createPaymentIntent,
    handleStripeWebhook,
};
