import httpStatus from 'http-status';
import bcrypt from "bcryptjs";
import { jwtHelper } from "../../helper/jwtHelper";
import { prisma } from "../../../lib/prisma";
import { UserStatus } from "../../../generated/prisma/enums";
import config from "../../config";
import ApiError from "../../errors/ApiError";

type LoginPayload = { email: string; password: string };

const login = async (payload: LoginPayload) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: { email: payload.email },
    });

    if (user.status !== UserStatus.ACTIVE) {
        throw new ApiError(httpStatus.FORBIDDEN, "User is not active");
    }

    const isCorrect = await bcrypt.compare(payload.password, user.password);
    if (!isCorrect) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Password is incorrect!");
    }

    const accessToken = jwtHelper.generateToken(
        { email: user.email, role: user.role },
        config.jwt_access_secret,
        config.jwt_access_expires
    );

    const refreshToken = jwtHelper.generateToken(
        { email: user.email, role: user.role },
        config.jwt_refresh_secret,
        config.jwt_refresh_expires
    );

    return { accessToken, refreshToken, needPasswordChange: user.needPasswordChange };
};

const getMe = async (session: any) => {
    const token = session.accessToken;
    if (!token) throw new ApiError(httpStatus.UNAUTHORIZED, "No access token");

    const decoded: any = jwtHelper.verifyToken(token, config.jwt_access_secret);
    const user = await prisma.user.findUniqueOrThrow({ where: { email: decoded.email } });

    return {
        id: user.id,
        email: user.email,
        role: user.role,
        needPasswordChange: user.needPasswordChange,
        status: user.status,
    };
};

const refreshToken = async (token: string | undefined) => {
    if (!token) throw new ApiError(httpStatus.UNAUTHORIZED, "No refresh token");

    let decoded: any;
    try {
        decoded = jwtHelper.verifyToken(token, config.jwt_refresh_secret);
    } catch (err) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
    }

    const user = await prisma.user.findUniqueOrThrow({ where: { email: decoded.email } });
    if (user.status !== UserStatus.ACTIVE) {
        throw new ApiError(httpStatus.FORBIDDEN, "User is not active");
    }

    const accessToken = jwtHelper.generateToken(
        { email: user.email, role: user.role },
        config.jwt_access_secret,
        config.jwt_access_expires
    );

    return { accessToken, needPasswordChange: user.needPasswordChange };
};


export const AuthService = {
    login,
    getMe,
    refreshToken
}