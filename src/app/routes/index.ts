import express from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { productRoutes } from '../modules/product/product.route';
import path from 'path';
import { CartRoutes } from '../modules/cart/cart.route';
 

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
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;