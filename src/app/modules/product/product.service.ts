import { Request } from "express";
import { prisma } from "../../shared/prisma";
import { fileUploader } from "../../helper/fileUploader";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { Prisma } from "@prisma/client";
import { productSearchableFields } from "./product.constant";
 
const createProductCategory = async (req: Request) => {
  const { name, isActive = true } = req.body;

  let imageUrl: string | undefined;

  // Upload image if file exists
  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    imageUrl = uploadResult?.secure_url;
  }

  const category = await prisma.category.create({
    data: {
      name,
      isActive,
      // optional image URL
      imageUrl,
    },
  });

  return category;
};

const createProduct = async (req: Request & { user?: any }) => {
  // 1️⃣ Make sure user is authenticated
  if (!req.user) {
    throw new Error("Unauthorized");
  }

  const userExists = await prisma.user.findUnique({
    where: { email: req.user.email },
  });

  // 2️⃣ Fetch seller profile from DB using userId
  const seller = await prisma.seller.findUnique({
    where: { userId: userExists?.id },
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
  const uploadResult = await fileUploader.uploadToCloudinary(req.file);

  // 6️⃣ Create product
  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      categoryId,
      sellerId, // ✅ Correct sellerId
      imageUrl: uploadResult!.secure_url,
    },
  });

  return product;
};

const getAllProduct = async (filters: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const {
    searchTerm,
    minPrice,
    maxPrice,
    inStock,
    categoryId,
    sellerId,
    isActive,
  } = filters;

  const andConditions: Prisma.ProductWhereInput[] = [];

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
      price: {
        ...(minPrice !== undefined && { gte: Number(minPrice) }),
        ...(maxPrice !== undefined && { lte: Number(maxPrice) }),
      },
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

  const whereConditions: Prisma.ProductWhereInput =
    andConditions.length ? { AND: andConditions } : {};

  const products = await prisma.product.findMany({
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

  const total = await prisma.product.count({
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
};

export const ProductService = {
  createProduct,
  createProductCategory,
  getAllProduct
};
