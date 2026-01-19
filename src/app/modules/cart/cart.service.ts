import { prisma } from "../../shared/prisma";

const addToCart = async (
  userId: string,
  payload: { productId: string; quantity: number }
) => {
  const { productId, quantity } = payload;

  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity,
      },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });
};

const getMyCart = async (userId: string) => {
  return prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
};

const updateCartItem = async (
  userId: string,
  payload: { productId: string; quantity: number }
) => {
  const cart = await prisma.cart.findUniqueOrThrow({
    where: { userId },
  });

  return prisma.cartItem.update({
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
};

const removeFromCart = async (userId: string, productId: string) => {
  const cart = await prisma.cart.findUniqueOrThrow({
    where: { userId },
  });

  return prisma.cartItem.delete({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });
};

export const CartService = {
  addToCart,
  getMyCart,
  updateCartItem,
  removeFromCart,
};
