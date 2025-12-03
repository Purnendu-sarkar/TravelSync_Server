
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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const searchTerm = req.query.searchTerm as string | undefined;
    const sortBy = req.query.sortBy as string | undefined;
    const sortOrder = req.query.sortOrder === "asc" || req.query.sortOrder === "desc"
        ? req.query.sortOrder
        : "desc";


    const result = await UserService.getAllFromDB({
        page,
        limit,
        searchTerm,
        sortBy,
        sortOrder,
    });

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