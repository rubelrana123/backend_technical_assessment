import express from "express";
import { CartController } from "./cart.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/add",
  auth(UserRole.BUYER),
  CartController.addToCart
);

router.get(
  "/my-cart",
  auth(UserRole.BUYER),
  CartController.getMyCart
);

router.patch(
  "/update",
  auth(UserRole.BUYER),
  CartController.updateCartItem
);

router.delete(
  "/remove/:productId",
  auth(UserRole.BUYER),
  CartController.removeFromCart
);

export const CartRoutes = router;
