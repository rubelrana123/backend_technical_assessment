"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = exports.createProductCategoryValidationSchema = void 0;
const zod_1 = require("zod");
// Category Validation
exports.createProductCategoryValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Category name is required"),
    isActive: zod_1.z.boolean().optional(),
});
const createProductValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Product name is required"),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().positive("Price must be positive"),
    stock: zod_1.z.number().int().nonnegative("Stock must be 0 or more"),
    categoryId: zod_1.z.string().uuid("Invalid category id"),
});
exports.ProductValidation = {
    createProductValidationSchema,
    createProductCategoryValidationSchema: exports.createProductCategoryValidationSchema
};
