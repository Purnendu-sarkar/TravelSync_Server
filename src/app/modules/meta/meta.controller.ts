import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { IJWTPayload } from "../../types/common";
import { MetaService } from "./meta.service";

const getDashboardMeta = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user as IJWTPayload;
    const result = await MetaService.getDashboardMeta(user);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Dashboard metadata retrieved successfully!",
        data: result,
    });
});

export const MetaController = {
    getDashboardMeta,
};