import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { fileUploader } from "../../helper/fileUploader";
import { Request } from "express";
import config from "../../config";
import { paginationHelper } from "../../helper/paginationHelper";
import { Prisma } from "../../../generated/prisma/client";
import { userSearchableFields } from "./user.constant";


const createTraveler = async (req: Request) => {
    // 1. Handle profile image upload
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.traveler.profilePhoto = uploadResult?.secure_url
        // console.log("Photo", uploadResult)
    }

    const { password, traveler } = req.body;
    const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_rounds);

    // 2. Prisma Transaction
    const result = await prisma.$transaction(async (tnx) => {
        // Create user
        await tnx.user.create({
            data: {
                email: traveler.email,
                password: hashedPassword,
                role: "TRAVELER",
                status: "ACTIVE",
            },
        });
        // Create traveler profile
        return await tnx.traveler.create({
            data: traveler,
        });
    });

    return result;
}



const getAllFromDB = async (params: any, options: any) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options)
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.UserWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {}

    const result = await prisma.user.findMany({
        skip,
        take: limit,

        where: whereConditions,
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.user.count({
        where: whereConditions
    });
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
}
export const UserService = {
    createTraveler,
    getAllFromDB
}