
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AuthService } from "./auth.service";
import config from "../../config";

const cookieOptions = {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: config.node_env === "production" ? "none" as const : "lax" as const,
};


const login = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    const { accessToken, refreshToken, needPasswordChange } = result;

    res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 1000 * 60 * 60, // 1 hour
    });
    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User logged in successfully!",
        data: { needPasswordChange },
    });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
    const session = req.cookies;
    const result = await AuthService.getMe(session);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User retrieved successfully 🤷‍♂️",
        data: result,
    });
});

export const AuthController = {
    login,
    getMe
}