"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRoutes = void 0;
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("./cart.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/add", (0, auth_1.default)(client_1.UserRole.BUYER), cart_controller_1.CartController.addToCart);
router.get("/my-cart", (0, auth_1.default)(client_1.UserRole.BUYER), cart_controller_1.CartController.getMyCart);
router.patch("/update", (0, auth_1.default)(client_1.UserRole.BUYER), cart_controller_1.CartController.updateCartItem);
router.delete("/remove/:productId", (0, auth_1.default)(client_1.UserRole.BUYER), cart_controller_1.CartController.removeFromCart);
exports.CartRoutes = router;
