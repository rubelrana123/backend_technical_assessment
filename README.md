# backend_technical_assessment

## Project Overview
Backend API for an e-commerce-style system with role-based access (admin, seller, buyer), product/catalog management, cart features, authentication, and media uploads. It uses Prisma with PostgreSQL and integrates JWT auth, Cloudinary for file storage, and Stripe utilities for payments.

## Technology
- Node.js, Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod validation
- JWT auth + refresh tokens
- Multer + Cloudinary (file uploads)
- Stripe
- Nodemailer

## API Routes
Base URL: `/api/v1`

Auth
- `GET /auth/me`
- `POST /auth/login`
- `POST /auth/refresh-token`
- `POST /auth/change-password` (admin/seller/buyer)
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

Users
- `POST /user/create-buyer`
- `POST /user/create-seller`
- `POST /user/create-admin`

Products
- `POST /product/create-category` (admin/seller)
- `POST /product/create-product` (seller)
- `GET /product/` (admin/seller/buyer)

Cart
- `POST /cart/add` (buyer)
- `GET /cart/my-cart` (buyer)
- `PATCH /cart/update` (buyer)
- `DELETE /cart/remove/:productId` (buyer)

## Credentials
Dev super admin (from `.env`):
- Email: `super@admin.com`
- Password: `superadmin`

Replace these values for production deployments.
