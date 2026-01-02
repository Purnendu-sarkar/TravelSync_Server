import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { SubscriptionService } from "./subscription.service";

const getPlans = catchAsync(async (req: Request, res: Response) => {
    const result = await SubscriptionService.getPlans();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Subscription plans retrieved successfully!",
        data: result,
    });
});

export const SubscriptionController = {
    getPlans,
};