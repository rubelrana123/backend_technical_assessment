import { prisma } from "../../shared/prisma";

const addToCart = async (
  user: any,
  payload: { productId: string; quantity: number }
) => {
  const { productId, quantity } = payload;

  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: { email: user.email },
  });
  let cart = await prisma.cart.findUnique({
    where: { userId: isUserExist.id },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: isUserExist.id },
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

const getMyCart = async (user: any) => {
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: { email: user.email },
  });
  return prisma.cart.findUnique({
    where: { userId: isUserExist.id },
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
  user: any,
  payload: { productId: string; quantity: number }
) => {
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: { email: user.email },
  });
  const cart = await prisma.cart.findUniqueOrThrow({
    where: { userId: isUserExist.id },
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

const removeFromCart = async (user: any, productId: string) => {
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: { email: user.email },
  });

  const cart = await prisma.cart.findUniqueOrThrow({
    where: { userId: isUserExist.id },
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
