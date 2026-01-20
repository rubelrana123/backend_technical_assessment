"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// Create Stripe Payment Intent
router.post("/create-payment-intent", (0, auth_1.default)(client_1.UserRole.BUYER), payment_controller_1.PaymentController.createPaymentIntent);
// Stripe webhook endpoint
router.post("/webhook", express_1.default.raw({ type: "application/json" }), payment_controller_1.PaymentController.stripeWebhook);
exports.PaymentRoutes = router;
