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
exports.CartController = void 0;
const cart_service_1 = require("./cart.service");
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cart_service_1.CartService.addToCart(req.user.id, req.body);
    res.status(200).json({
        success: true,
        message: "Product added to cart",
        data: result,
    });
});
const getMyCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cart_service_1.CartService.getMyCart(req.user.id);
    res.status(200).json({
        success: true,
        data: result,
    });
});
const updateCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cart_service_1.CartService.updateCartItem(req.user.id, req.body);
    res.status(200).json({
        success: true,
        message: "Cart updated",
        data: result,
    });
});
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cart_service_1.CartService.removeFromCart(req.user.id, req.params.productId);
    res.status(200).json({
        success: true,
        message: "Item removed from cart",
        data: result,
    });
});
exports.CartController = {
    addToCart,
    getMyCart,
    updateCartItem,
    removeFromCart,
};
