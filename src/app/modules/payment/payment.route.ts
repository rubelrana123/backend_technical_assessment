import express from "express";
import { PaymentController } from "./payment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// Create Stripe Payment Intent
router.post(
  "/create-payment-intent",
  auth(UserRole.BUYER),
  PaymentController.createPaymentIntent
);

// Stripe webhook endpoint
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.stripeWebhook
);

export const PaymentRoutes = router;
