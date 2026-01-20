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
exports.OrderService = void 0;
const prisma_1 = require("../../shared/prisma");
const client_1 = require("@prisma/client");
const checkout = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const cart = yield tx.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });
        if (!cart || cart.items.length === 0) {
            throw new Error("Cart is empty");
        }
        let totalAmount = 0;
        cart.items.forEach((item) => {
            totalAmount += item.product.price * item.quantity;
        });
        const order = yield tx.order.create({
            data: {
                userId,
                totalAmount,
                status: client_1.OrderStatus.PENDING,
            },
        });
        for (const item of cart.items) {
            yield tx.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: item.productId,
                    price: item.product.price,
                    quantity: item.quantity,
                },
            });
            yield tx.product.update({
                where: { id: item.productId },
                data: {
                    stock: { decrement: item.quantity },
                },
            });
        }
        yield tx.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
        return order;
    }));
});
const getMyOrders = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.prisma.order.findMany({
        where: { userId },
        include: {
            items: {
                include: { product: true },
            },
            payments: true,
        },
        orderBy: { createdAt: "desc" },
    });
});
exports.OrderService = {
    checkout,
    getMyOrders,
};
