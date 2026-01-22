import express from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { productRoutes } from '../modules/product/product.route';
import path from 'path';
import { CartRoutes } from '../modules/cart/cart.route';
import { OrderRoutes } from '../modules/order/order.route';
import { PaymentRoutes } from '../modules/payment/payment.route';
 

const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/auth',
        route: authRoutes
    },
    {
        path: '/product',
        route : productRoutes
    },
    {
        path: "/cart",
        route : CartRoutes
    },
    {
        path: "/order",
        route : OrderRoutes
    },
    {
        path : "/payment",
        route : PaymentRoutes
    }
 
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;