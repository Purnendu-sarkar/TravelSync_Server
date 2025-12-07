import z from "zod";

const createTravelPlanValidationSchema = z.object({
    destination: z.string().nonempty("Destination is required"),
    startDate: z.coerce.date({ message: "Valid start date is required" }),
    endDate: z.coerce.date({ message: "Valid end date is required" }),
    budget: z.number().positive("Budget must be positive"),
    travelType: z.enum(["ADVENTURE", "LEISURE", "BUSINESS", "FAMILY", "SOLO"]),
    itinerary: z.string().optional(),
    description: z.string().optional(),
});



export const TravelPlanValidation = {
    createTravelPlanValidationSchema,
};