import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { UserService } from "./user.service";
import pick from "../../helper/pick";
import { userFilterableFields } from "./user.constant";

const createTraveler = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createTraveler(req);
    console.log(result)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Traveler created successfully! 🎉",
        data: result
    })
})

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, userFilterableFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await UserService.getAllFromDB(filters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Users retrieved successfully!✅",
        data: result
    });
});


export const UserController = {
    createTraveler,
    getAllFromDB
}