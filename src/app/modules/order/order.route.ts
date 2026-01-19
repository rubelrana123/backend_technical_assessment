import express from "express";
 
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { OrderController } from "./order.controller";

const router = express.Router();

router.post(
  "/checkout",
  auth(UserRole.BUYER),
  OrderController.checkout
);

router.get(
  "/my-orders",
  auth(UserRole.BUYER),
  OrderController.getMyOrders
);

export const OrderRoutes = router;
