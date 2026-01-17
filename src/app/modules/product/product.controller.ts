import { Request, Response, NextFunction } from "express";
import { ProductService } from "./product.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";

const createProductCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await ProductService.createProductCategory(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Product category created successfully!",
        data: result
    })
});

const createProduct = catchAsync(async (req: Request, res: Response) => {
    const result = await ProductService.createProduct(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Product created successfully!",
        data: result
    })
});

 
export const ProductController = {
  createProduct,
  createProductCategory
};
