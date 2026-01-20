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
exports.PaymentController = void 0;
const payment_service_1 = require("./payment.service");
const createPaymentIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.body;
    const clientSecret = yield payment_service_1.PaymentService.createPaymentIntent(req.user.id, orderId);
    res.status(200).json({
        success: true,
        clientSecret,
    });
});
const stripeWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield payment_service_1.PaymentService.handleStripeWebhook(req);
    res.status(200).send("Webhook received");
});
exports.PaymentController = {
    createPaymentIntent,
    stripeWebhook,
};
