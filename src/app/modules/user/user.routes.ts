import express, { NextFunction, Request, Response } from 'express'
import { UserController } from './user.controller';
import { fileUploader } from '../../helper/fileUploader';
import { UserValidation } from './user.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

//get all users

// create buyer
router.post(
    "/create-buyer",
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createBuyerValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createBuyer(req, res, next)
    }

)

// create seller
router.post(
    "/create-seller",
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createSellerValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createSeller(req, res, next)
    }

)

// create admin 

router.post(
    "/create-admin",
    // auth(UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createAdminValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createAdmin(req, res, next)
    }
);


export const userRoutes = router;