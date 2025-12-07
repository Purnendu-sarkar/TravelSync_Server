import { prisma } from "../../../lib/prisma";
import { TravelPlan, UserRole } from "../../../generated/prisma/client";
import { IJWTPayload } from "../../types/common";
import { CreateTravelPlanInput } from "./travelPlan.interface";

import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";

const createTravelPlan = async (user: IJWTPayload, payload: CreateTravelPlanInput): Promise<TravelPlan> => {
    if (user.role !== UserRole.TRAVELER) {
        throw new ApiError(httpStatus.FORBIDDEN, "Only travelers can create plans");
    }

    const traveler = await prisma.traveler.findUniqueOrThrow({ where: { email: user.email } });

    return prisma.travelPlan.create({
        data: {
            ...payload,
            travelerId: traveler.id,
        },
    });
};

export const TravelPlanService = {
    createTravelPlan,
};