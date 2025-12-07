import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { TravelPlanService } from "./travelPlan.service";
import { IJWTPayload } from "../../types/common";
import pick from "../../helper/pick";
import { travelPlanFilterableFields } from "./travelPlan.constant";

const createTravelPlan = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user as IJWTPayload;
    const result = await TravelPlanService.createTravelPlan(user, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Travel plan created successfully! 🎉",
        data: result,
    });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, travelPlanFilterableFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await TravelPlanService.getAllFromDB(filters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Travel plans retrieved successfully!✅",
        data: result,
    });
});

const getMyTravelPlans = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user as IJWTPayload;
    const filters = pick(req.query, travelPlanFilterableFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await TravelPlanService.getMyTravelPlans(user, filters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "My travel plans retrieved successfully!✅",
        data: result,
    });
});


export const TravelPlanController = {
    createTravelPlan,
    getAllFromDB,
    getMyTravelPlans,

};