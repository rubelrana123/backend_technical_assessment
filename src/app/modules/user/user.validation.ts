import { z } from "zod";

/**
 * Shared profile schema
 */
const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

/**
 * CREATE BUYER
 */
const createBuyerValidationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  profile: profileSchema,
});

/**
 * CREATE ADMIN
 */
const createAdminValidationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  profile: profileSchema,
});

/**
 * CREATE SELLER
 */
const createSellerValidationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  shopName: z.string().min(1, "Shop name is required"),
  profile: profileSchema,
});

export const UserValidation = {
  createBuyerValidationSchema,
  createAdminValidationSchema,
  createSellerValidationSchema,
};
