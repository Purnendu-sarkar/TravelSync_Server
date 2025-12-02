
import z from "zod";

const createTravelerValidationSchema = z.object({
    password: z.string(),
    traveler: z.object({
        name: z.string().nonempty("Name is required"),
        email: z.string().nonempty("Email is required")
    })
});

export const UserValidation = {
    createTravelerValidationSchema
}