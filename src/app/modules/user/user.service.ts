import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { fileUploader } from "../../helper/fileUploader";
import { Request } from "express";
import config from "../../config";


const createTraveler = async (req: Request) => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.traveler.profilePhoto = uploadResult?.secure_url
        console.log(uploadResult)
    }

    // const { password, traveler } = req.body;
    const hashPassword = await bcrypt.hash(req.body.password, config.bcrypt_salt_rounds);

    const result = await prisma.$transaction(async (tnx: any) => {
        // Create user
        await tnx.user.create({
            data: {
                email: req.body.traveler.email,
                password: hashPassword
            }
        });

        // Create traveler profile
        return await tnx.traveler.create({
            data: req.body.traveler
        })
    })

    return result;

}



const getAllFromDB = async ({
    page,
    limit,
    searchTerm,
}: {
    page: number;
    limit: number;
    searchTerm?: string;
}) => {
    const skip = (page - 1) * limit;
    const result = await prisma.user.findMany({
        skip,
        take: limit,

        where: searchTerm
            ? {
                email: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            }
            : {}
    });
    return result;
}

export const UserService = {
    createTraveler,
    getAllFromDB
}