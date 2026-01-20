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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_1 = require("../../shared/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const fileUploader_1 = require("../../helper/fileUploader");
const client_1 = require("@prisma/client");
//create buyer
const createBuyer = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, profile } = req.body;
    if (req.file) {
        const uploadResult = yield fileUploader_1.fileUploader.uploadToCloudinary(req.file);
        profile.profilePhoto = uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.secure_url;
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield tx.user.create({
            data: {
                email,
                password: hashedPassword,
                role: client_1.UserRole.BUYER,
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
        const userProfile = yield tx.userProfile.create({
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
    }));
    return result;
});
// CREATE SELLER
const createSeller = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, profile, shopName } = req.body;
    if (req.file) {
        const uploadResult = yield fileUploader_1.fileUploader.uploadToCloudinary(req.file);
        profile.profilePhoto = uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.secure_url;
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield tx.user.create({
            data: {
                email,
                password: hashedPassword,
                role: client_1.UserRole.SELLER,
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
        const userProfile = yield tx.userProfile.create({
            data: {
                userId: user.id,
                name: profile.name,
                phone: profile.phone,
                address: profile.address,
                profilePhoto: profile.profilePhoto,
            },
        });
        const seller = yield tx.seller.create({
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
    }));
    return result;
});
/**
 * CREATE ADMIN
 */
const createAdmin = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, profile } = req.body;
    if (req.file) {
        const uploadResult = yield fileUploader_1.fileUploader.uploadToCloudinary(req.file);
        profile.profilePhoto = uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.secure_url;
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield tx.user.create({
            data: {
                email,
                password: hashedPassword,
                role: client_1.UserRole.ADMIN,
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
        const userProfile = yield tx.userProfile.create({
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
    }));
    return result;
});
exports.UserService = {
    createBuyer,
    createAdmin,
    createSeller
};
