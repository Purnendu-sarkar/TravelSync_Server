
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { UserService } from "./user.service";

const createTraveler = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createTraveler(req);
    console.log(result)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Traveler created successfully!✅",
        data: result
    })
})

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getAllFromDB();

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User retrieved successfully!✅",
        data: result
    })
})


export const UserController = {
    createTraveler,
    getAllFromDB
}