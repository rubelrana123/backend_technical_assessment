"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = __importDefault(require("express"));
const fileUploader_1 = require("../../helper/fileUploader");
const product_controller_1 = require("./product.controller");
const product_validation_1 = require("./product.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
//create category
router.post("/create-category", (0, auth_1.default)(client_1.UserRole.SELLER, client_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload.single('file'), (req, res, next) => {
    req.body = product_validation_1.ProductValidation.createProductCategoryValidationSchema.parse(JSON.parse(req.body.data));
    return product_controller_1.ProductController.createProductCategory(req, res, next);
});
// create product
router.post("/create-product", (0, auth_1.default)(client_1.UserRole.SELLER), fileUploader_1.fileUploader.upload.single('file'), (req, res, next) => {
    req.body = product_validation_1.ProductValidation.createProductValidationSchema.parse(JSON.parse(req.body.data));
    return product_controller_1.ProductController.createProduct(req, res, next);
});
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SELLER, client_1.UserRole.BUYER), product_controller_1.ProductController.getAllProduct);
exports.productRoutes = router;
