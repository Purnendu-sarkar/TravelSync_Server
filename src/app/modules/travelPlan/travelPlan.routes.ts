import express from "express";
import { TravelPlanController } from "./travelPlan.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { TravelPlanValidation } from "./travelPlan.validation";

const router = express.Router();

router.get("/", TravelPlanController.getAllFromDB);

router.get(
    "/my-plans",
    auth(UserRole.TRAVELER),
    TravelPlanController.getMyTravelPlans
);

router.post(
    "/",
    auth(UserRole.TRAVELER),
    (req, res, next) => {
        req.body = TravelPlanValidation.createTravelPlanValidationSchema.parse(req.body);
        next();
    },
    TravelPlanController.createTravelPlan
);

export const travelPlanRoutes = router;