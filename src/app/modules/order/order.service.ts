import { prisma } from "../../shared/prisma";
import { OrderStatus } from "@prisma/client";

const checkout = async (user: any) => {
  return prisma.$transaction(async (tx) => {
    const isUserExist = await tx.user.findUniqueOrThrow({
      where: { email: user.email },
    });

    const cart = await tx.cart.findUnique({
      where: { userId: isUserExist.id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    let totalAmount = 0;

    cart.items.forEach((item) => {
      totalAmount += item.product.price * item.quantity;
    });

    const order = await tx.order.create({
      data: {
        userId: isUserExist.id,
        totalAmount,
        status: OrderStatus.PENDING,
      },
    });

    for (const item of cart.items) {
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          price: item.product.price,
          quantity: item.quantity,
        },
      });
    }

    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return order;
  });
};

const getMyOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
      payments: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const OrderService = {
  checkout,
  getMyOrders,
};
