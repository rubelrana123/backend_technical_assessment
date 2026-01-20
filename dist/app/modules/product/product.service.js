"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const prisma_1 = require("../../shared/prisma");
const fileUploader_1 = require("../../helper/fileUploader");
const paginationHelper_1 = require("../../helper/paginationHelper");
const createProductCategory = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, isActive = true } = req.body;
    let imageUrl;
    // Upload image if file exists
    if (req.file) {
        const uploadResult = yield fileUploader_1.fileUploader.uploadToCloudinary(req.file);
        imageUrl = uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.secure_url;
    }
    const category = yield prisma_1.prisma.category.create({
        data: {
            name,
            isActive,
            // optional image URL
            imageUrl,
        },
    });
    return category;
});
const createProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    // 1️⃣ Make sure user is authenticated
    if (!req.user) {
        throw new Error("Unauthorized");
    }
    const userExists = yield prisma_1.prisma.user.findUnique({
        where: { email: req.user.email },
    });
    // 2️⃣ Fetch seller profile from DB using userId
    const seller = yield prisma_1.prisma.seller.findUnique({
        where: { userId: userExists === null || userExists === void 0 ? void 0 : userExists.id },
    });
    if (!seller) {
        throw new Error("Seller profile not found for this user");
    }
    const sellerId = seller.id;
    // 3️⃣ Destructure product data
    const { name, description, price, stock, categoryId } = req.body;
    // 4️⃣ Validate file exists
    if (!req.file) {
        throw new Error("Product image is required");
    }
    // 5️⃣ Upload image to Cloudinary
    const uploadResult = yield fileUploader_1.fileUploader.uploadToCloudinary(req.file);
    // 6️⃣ Create product
    const product = yield prisma_1.prisma.product.create({
        data: {
            name,
            description,
            price: Number(price),
            stock: Number(stock),
            categoryId,
            sellerId, // ✅ Correct sellerId
            imageUrl: uploadResult.secure_url,
        },
    });
    return product;
});
const getAllProduct = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm, minPrice, maxPrice, inStock, categoryId, sellerId, isActive, } = filters;
    const andConditions = [];
    /* ================= SEARCH ================= */
    if (typeof searchTerm === "string" && searchTerm.trim() !== "") {
        const term = searchTerm.trim();
        andConditions.push({
            OR: [
                {
                    name: {
                        contains: term,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: term,
                        mode: "insensitive",
                    },
                },
                {
                    category: {
                        name: {
                            contains: term,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    seller: {
                        shopName: {
                            contains: term,
                            mode: "insensitive",
                        },
                    },
                },
            ],
        });
    }
    /* ================= PRICE RANGE ================= */
    if (minPrice !== undefined || maxPrice !== undefined) {
        andConditions.push({
            price: Object.assign(Object.assign({}, (minPrice !== undefined && { gte: Number(minPrice) })), (maxPrice !== undefined && { lte: Number(maxPrice) })),
        });
    }
    /* ================= STOCK ================= */
    if (inStock === "true") {
        andConditions.push({
            stock: { gt: 0 },
        });
    }
    /* ================= ACTIVE STATUS ================= */
    if (isActive === "true" || isActive === "false") {
        andConditions.push({
            isActive: isActive === "true",
        });
    }
    /* ================= CATEGORY ================= */
    if (categoryId) {
        andConditions.push({
            categoryId,
        });
    }
    /* ================= SELLER ================= */
    if (sellerId) {
        andConditions.push({
            sellerId,
        });
    }
    const whereConditions = andConditions.length ? { AND: andConditions } : {};
    const products = yield prisma_1.prisma.product.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy
            ? { [sortBy]: sortOrder === "asc" ? "asc" : "desc" }
            : { createdAt: "desc" },
        include: {
            category: true,
            seller: true,
        },
    });
    const total = yield prisma_1.prisma.product.count({
        where: whereConditions,
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: products,
    };
});
exports.ProductService = {
    createProduct,
    createProductCategory,
    getAllProduct
};
