"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
/**
 * Shared profile schema
 */
const profileSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
});
/**
 * CREATE BUYER
 */
const createBuyerValidationSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    profile: profileSchema,
});
/**
 * CREATE ADMIN
 */
const createAdminValidationSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    profile: profileSchema,
});
/**
 * CREATE SELLER
 */
const createSellerValidationSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    shopName: zod_1.z.string().min(1, "Shop name is required"),
    profile: profileSchema,
});
exports.UserValidation = {
    createBuyerValidationSchema,
    createAdminValidationSchema,
    createSellerValidationSchema,
};
