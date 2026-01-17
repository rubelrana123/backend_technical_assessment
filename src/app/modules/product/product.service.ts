import { Request } from "express";
import { prisma } from "../../shared/prisma";
import { fileUploader } from "../../helper/fileUploader";
  // const { email, password, profile, shopName } = req.body;

  // if (req.file) {
  //   const uploadResult = await fileUploader.uploadToCloudinary(req.file);
  //   profile.profilePhoto = uploadResult?.secure_url;
  // }

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
export const ProductService = {
  createProduct,
  createProductCategory
};
