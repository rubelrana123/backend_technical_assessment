import { z } from "zod";
 
// Category Validation
export const createProductCategoryValidationSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  isActive: z.boolean().optional(),
});


const createProductValidationSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  stock: z.number().int().nonnegative("Stock must be 0 or more"),
  categoryId: z.string().uuid("Invalid category id"),
});

export const ProductValidation = {
  createProductValidationSchema,
  createProductCategoryValidationSchema
};
