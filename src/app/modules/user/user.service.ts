import bcrypt from "bcryptjs";
import { createTravelerInput } from "./user.interface";
import { prisma } from "../../../lib/prisma";
import { fileUploader } from "../../helper/fileUploader";
import { Request } from "express";


const createTraveler = async (req: Request) => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        console.log(uploadResult)
    }

    const { password, traveler } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tnx: any) => {
        // Create user
        await tnx.user.create({
            data: {
                email: traveler.email,
                password: hashPassword
            }
        });

        // Create traveler profile
        return await tnx.traveler.create({
            data: {
                name: traveler.name,
                email: traveler.email
            }
        })
    })

    return result;

}

export const UserService = {
    createTraveler
}