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


export const AuthService = {
    login
}