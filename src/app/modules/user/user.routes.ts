import express, { NextFunction, Request, Response } from 'express'
import { UserController } from './user.controller';
import { fileUploader } from '../../helper/fileUploader';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post(
    "/create-buyer",
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createBuyerValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createBuyer(req, res, next)
    }

)

// create seller
// create admin

export const userRoutes = router;