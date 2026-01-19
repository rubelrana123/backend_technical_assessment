import { Request, Response } from "express";
import { OrderService } from "./order.service";

const checkout = async (req: Request & { user?: any }, res: Response) => {
  const result = await OrderService.checkout(req.user!.id);
  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: result,
  });
};

const getMyOrders = async (req: Request & { user?: any }, res: Response) => {
  const result = await OrderService.getMyOrders(req.user!.id);
  res.status(200).json({
    success: true,
    data: result,
  });
};

export const OrderController = {
  checkout,
  getMyOrders,
};
