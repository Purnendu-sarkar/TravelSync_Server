import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { IJWTPayload } from "../../types/common";
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

const getMySubscriptionStatus = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user as IJWTPayload;
    const result = await SubscriptionService.getMySubscriptionStatus(user);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Subscription status retrieved successfully!",
        data: result,
    });
});

const webhook = catchAsync(async (req: Request, res: Response) => {
    await SubscriptionService.handleWebhook(req);
    res.status(200).json({ received: true });
});


export const SubscriptionController = {
    getPlans,
    createCheckoutSession,
    getMySubscriptionStatus,
    webhook
};