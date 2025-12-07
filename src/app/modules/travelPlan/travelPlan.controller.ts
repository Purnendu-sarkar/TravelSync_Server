import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { TravelPlanService } from "./travelPlan.service";
import { IJWTPayload } from "../../types/common";

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

export const TravelPlanController = {
    createTravelPlan,
};