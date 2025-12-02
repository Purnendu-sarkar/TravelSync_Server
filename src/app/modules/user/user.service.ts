import bcrypt from "bcryptjs";
import { createTravelerInput } from "./user.interface";
import { prisma } from "../../../lib/prisma";


const createTraveler = async (payload: createTravelerInput) => {
    const hashPassword = await bcrypt.hash(payload.password, 10);

    const result = await prisma.$transaction(async (tnx: any) => {
        await tnx.user.create({
            data: {
                email: payload.email,
                password: hashPassword
            }
        });

        return await tnx.traveler.create({
            data: {
                name: payload.name,
                email: payload.email
            }
        })
    })

    return result;

}

export const UserService = {
    createTraveler
}