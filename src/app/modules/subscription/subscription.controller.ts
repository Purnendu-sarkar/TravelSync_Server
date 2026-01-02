import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { SubscriptionService } from "./subscription.service";
import { IJWTPayload } from "../../types/common";

const getPlans = catchAsync(async (req: Request, res: Response) => {
    const result = await SubscriptionService.getPlans();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Subscription plans retrieved successfully!",
        data: result,
    });
});

const createCheckoutSession = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user as IJWTPayload;
    const { planType } = req.body;
    const result = await SubscriptionService.createCheckoutSession(user, planType);
    console.log(result)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Checkout session created successfully!",
        data: result,
    });
});

export const SubscriptionController = {
    getPlans,
    createCheckoutSession,
};