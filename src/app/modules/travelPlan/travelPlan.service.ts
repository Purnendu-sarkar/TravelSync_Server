import { prisma } from "../../../lib/prisma";
import { Prisma, TravelPlan, UserRole } from "../../../generated/prisma/client";
import { IJWTPayload } from "../../types/common";
import { CreateTravelPlanInput, UpdateTravelPlanInput } from "./travelPlan.interface";

import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { paginationHelper } from "../../helper/paginationHelper";
import { travelPlanSearchableFields } from "./travelPlan.constant";

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

const getAllFromDB = async (params: any, options: any) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.TravelPlanWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: travelPlanSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }

    andConditions.push({ isDeleted: false });

    const whereConditions: Prisma.TravelPlanWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.travelPlan.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: { [sortBy]: sortOrder },
    });

    const total = await prisma.travelPlan.count({ where: whereConditions });
    const totalPages = Math.ceil(total / limit);

    return {
        meta: { page, limit, total, totalPages },
        data: result,
    };
};

const getMyTravelPlans = async (user: IJWTPayload, params: any, options: any) => {
    const traveler = await prisma.traveler.findUniqueOrThrow({ where: { email: user.email } });

    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.TravelPlanWhereInput[] = [{ travelerId: traveler.id }];

    if (searchTerm) {
        andConditions.push({
            OR: travelPlanSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }

    andConditions.push({ isDeleted: false });

    const whereConditions: Prisma.TravelPlanWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.travelPlan.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: { [sortBy]: sortOrder },
    });

    const total = await prisma.travelPlan.count({ where: whereConditions });
    const totalPages = Math.ceil(total / limit);

    return {
        meta: { page, limit, total, totalPages },
        data: result,
    };
};

const getSingleFromDB = async (id: string): Promise<TravelPlan | null> => {
    return prisma.travelPlan.findUnique({
        where: { id, isDeleted: false },
    });
};

const updateTravelPlan = async (user: IJWTPayload, id: string, payload: UpdateTravelPlanInput): Promise<TravelPlan> => {
    const plan = await prisma.travelPlan.findUniqueOrThrow({
        where: { id, isDeleted: false },
    });

    const traveler = await prisma.traveler.findUniqueOrThrow({ where: { email: user.email } });

    if (plan.travelerId !== traveler.id) {
        throw new ApiError(httpStatus.FORBIDDEN, "You can only update your own plans");
    }

    return prisma.travelPlan.update({
        where: { id },
        data: payload,
    });
};

const softDeleteTravelPlan = async (user: IJWTPayload, id: string): Promise<TravelPlan> => {
    const plan = await prisma.travelPlan.findUniqueOrThrow({
        where: { id, isDeleted: false },
    });

    const traveler = await prisma.traveler.findUniqueOrThrow({ where: { email: user.email } });

    if (plan.travelerId !== traveler.id) {
        throw new ApiError(httpStatus.FORBIDDEN, "You can only delete your own plans");
    }

    return prisma.travelPlan.update({
        where: { id },
        data: { isDeleted: true },
    });
};


export const TravelPlanService = {
    createTravelPlan,
    getAllFromDB,
    getMyTravelPlans,
    getSingleFromDB,
    updateTravelPlan,
    softDeleteTravelPlan
};