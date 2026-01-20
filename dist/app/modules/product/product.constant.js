"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSearchableFields = exports.productFilterableFields = void 0;
exports.productFilterableFields = [
    "searchTerm",
    "minPrice",
    "maxPrice",
    "inStock",
    "categoryId",
    "sellerId",
    "isActive",
];
exports.productSearchableFields = {
    product: ["name", "description"],
    category: ["name"],
    seller: ["shopName"],
};
