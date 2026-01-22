import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { OrderService } from "./order.service";
import httpStatus from "http-status";

const checkout = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const result = await OrderService.checkout(req.user!);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order placed successfully",
    data: result,
  });
});

const getMyOrders = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const result = await OrderService.getMyOrders(req.user!.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: result,
    message: "get user's orders successfully",
  });
});

export const OrderController = {
  checkout,
  getMyOrders,
};
