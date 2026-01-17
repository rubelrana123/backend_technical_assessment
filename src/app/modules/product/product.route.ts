import express, { NextFunction, Request, Response } from 'express';
 
import { ProductService } from './product.service';
import { fileUploader } from '../../helper/fileUploader';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
 
const router = express.Router();

//create category
router.post(
    "/create-category",
    auth(UserRole.SELLER, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = ProductValidation.createProductCategoryValidationSchema.parse(JSON.parse(req.body.data))
        return ProductController.createProductCategory(req, res, next)
    }

)

// create product
router.post(
    "/create-product",
    auth(UserRole.SELLER),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = ProductValidation.createProductValidationSchema.parse(JSON.parse(req.body.data))
        return ProductController.createProduct(req, res, next)
    }
)
export const productRoutes = router;