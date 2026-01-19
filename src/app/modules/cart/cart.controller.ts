import { Request, Response } from "express";
import { CartService } from "./cart.service";

const addToCart = async (req: Request & { user?: any }, res: Response) => {
  const result = await CartService.addToCart(req.user!.id, req.body);
  res.status(200).json({
    success: true,
    message: "Product added to cart",
    data: result,
  });
};

const getMyCart = async (req: Request & { user?: any }, res: Response) => {
  const result = await CartService.getMyCart(req.user!.id);
  res.status(200).json({
    success: true,
    data: result,
  });
};

const updateCartItem = async (req: Request & { user?: any }, res: Response) => {
  const result = await CartService.updateCartItem(req.user!.id, req.body);
  res.status(200).json({
    success: true,
    message: "Cart updated",
    data: result,
  });
};

const removeFromCart = async (req: Request & { user?: any }, res: Response) => {
  const result = await CartService.removeFromCart(
    req.user!.id,
    req.params.productId as string
  );
  res.status(200).json({
    success: true,
    message: "Item removed from cart",
    data: result,
  });
};

export const CartController = {
  addToCart,
  getMyCart,
  updateCartItem,
  removeFromCart,
};
