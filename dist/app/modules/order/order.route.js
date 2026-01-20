"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const order_controller_1 = require("./order.controller");
const router = express_1.default.Router();
router.post("/checkout", (0, auth_1.default)(client_1.UserRole.BUYER), order_controller_1.OrderController.checkout);
router.get("/my-orders", (0, auth_1.default)(client_1.UserRole.BUYER), order_controller_1.OrderController.getMyOrders);
exports.OrderRoutes = router;
