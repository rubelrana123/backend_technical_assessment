import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";

const createBuyer = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createBuyer(req);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Buyer created successfully!",
        data: result
    })
})

const createAdmin = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.createAdmin(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Admin Created successfuly!",
        data: result
    })
});

export const UserController = {
    createBuyer,
    createAdmin
}