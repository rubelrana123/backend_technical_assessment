"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const fileUploader_1 = require("../../helper/fileUploader");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
//get all users
// create buyer
router.post("/create-buyer", fileUploader_1.fileUploader.upload.single('file'), (req, res, next) => {
    req.body = user_validation_1.UserValidation.createBuyerValidationSchema.parse(JSON.parse(req.body.data));
    return user_controller_1.UserController.createBuyer(req, res, next);
});
// create seller
router.post("/create-seller", fileUploader_1.fileUploader.upload.single('file'), (req, res, next) => {
    req.body = user_validation_1.UserValidation.createSellerValidationSchema.parse(JSON.parse(req.body.data));
    return user_controller_1.UserController.createSeller(req, res, next);
});
// create admin 
router.post("/create-admin", 
// auth(UserRole.ADMIN),
fileUploader_1.fileUploader.upload.single('file'), (req, res, next) => {
    req.body = user_validation_1.UserValidation.createAdminValidationSchema.parse(JSON.parse(req.body.data));
    return user_controller_1.UserController.createAdmin(req, res, next);
});
exports.userRoutes = router;
