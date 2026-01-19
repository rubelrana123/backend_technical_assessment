import { Request, Response, NextFunction } from "express";
import { ProductService } from "./product.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helper/pick";
import { productFilterableFields } from "./product.constant";

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

const getAllProduct = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const filters = pick(req.query, productFilterableFields);

  const result = await ProductService.getAllProduct(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Products retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});


 
export const ProductController = {
  createProduct,
  createProductCategory,
  getAllProduct
};
