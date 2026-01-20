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
exports.CartService = void 0;
const prisma_1 = require("../../shared/prisma");
const addToCart = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, quantity } = payload;
    let cart = yield prisma_1.prisma.cart.findUnique({
        where: { userId },
    });
    if (!cart) {
        cart = yield prisma_1.prisma.cart.create({
            data: { userId },
        });
    }
    const existingItem = yield prisma_1.prisma.cartItem.findUnique({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId,
            },
        },
    });
    if (existingItem) {
        return prisma_1.prisma.cartItem.update({
            where: { id: existingItem.id },
            data: {
                quantity: existingItem.quantity + quantity,
            },
        });
    }
    return prisma_1.prisma.cartItem.create({
        data: {
            cartId: cart.id,
            productId,
            quantity,
        },
    });
});
const getMyCart = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.prisma.cart.findUnique({
        where: { userId },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    });
});
const updateCartItem = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield prisma_1.prisma.cart.findUniqueOrThrow({
        where: { userId },
    });
    return prisma_1.prisma.cartItem.update({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId: payload.productId,
            },
        },
        data: {
            quantity: payload.quantity,
        },
    });
});
const removeFromCart = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield prisma_1.prisma.cart.findUniqueOrThrow({
        where: { userId },
    });
    return prisma_1.prisma.cartItem.delete({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId,
            },
        },
    });
});
exports.CartService = {
    addToCart,
    getMyCart,
    updateCartItem,
    removeFromCart,
};
