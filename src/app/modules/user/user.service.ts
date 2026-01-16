import { Request } from "express";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import { fileUploader } from "../../helper/fileUploader";
import { UserRole } from "@prisma/client";

//create buyer
const createBuyer = async (req: Request) => {
  const { email, password, profile } = req.body;

  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    profile.profilePhoto = uploadResult?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        role: UserRole.BUYER,
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const userProfile = await tx.userProfile.create({
      data: {
        userId: user.id,
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        profilePhoto: profile.profilePhoto,
      },
    });

    return {
      user,
      profile: userProfile,
    };
  });

  return result;
};

 
// CREATE SELLER
 
const createSeller = async (req: Request) => {
  const { email, password, profile, shopName } = req.body;

  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    profile.profilePhoto = uploadResult?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        role: UserRole.SELLER,
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const userProfile = await tx.userProfile.create({
      data: {
        userId: user.id,
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        profilePhoto: profile.profilePhoto,
      },
    });

    const seller = await tx.seller.create({
      data: {
        userId: user.id,
        shopName,
      },
    });

    return {
      user,
      profile: userProfile,
      seller,
    };
  });

  return result;
};


/**
 * CREATE ADMIN
 */
const createAdmin = async (req: Request) => {
  const { email, password, profile } = req.body;

  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    profile.profilePhoto = uploadResult?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const userProfile = await tx.userProfile.create({
      data: {
        userId: user.id,
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        profilePhoto: profile.profilePhoto,
      },
    });

    return {
      user,
      profile: userProfile,
    };
  });

  return result;
};


export const UserService = {
  createBuyer,
  createAdmin,
  createSeller
};
