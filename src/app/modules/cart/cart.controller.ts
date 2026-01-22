import { Request, Response } from "express";
import { CartService } from "./cart.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
const addToCart = catchAsync(async (req: Request & { user?: any }, res: Response) => {
 console.log(req?.user,"and ", req.body)
  
  const result = await CartService.addToCart(req?.user, req.body);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Product added to cart",
            data: result,
        });
});

const getMyCart = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const result = await CartService.getMyCart(req.user!);
 sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User's cart retrieved successfully",
            data: result,
        });
});

const updateCartItem = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const result = await CartService.updateCartItem(req.user, req.body);
  sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Cart item updated successfully",
            data: result,
        }); 
});

const removeFromCart = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const result = await CartService.removeFromCart(
    req.user!,
    req.params.productId as string
  );
  sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Item removed from cart successfully",
            data: result,
        });
});

export const CartController = {
  addToCart,
  getMyCart,
  updateCartItem,
  removeFromCart,
};
