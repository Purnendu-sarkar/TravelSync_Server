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

router.get("/:id", TravelPlanController.getSingleFromDB);

router.get(
    "/admin/:id",
    auth(UserRole.ADMIN),
    TravelPlanController.getSingleForAdmin
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

router.patch(
    "/:id",
    auth(UserRole.TRAVELER),
    (req, res, next) => {
        req.body = TravelPlanValidation.updateTravelPlanValidationSchema.parse(req.body);
        next();
    },
    TravelPlanController.updateTravelPlan
);

router.delete(
    "/:id",
    auth(UserRole.TRAVELER),
    TravelPlanController.softDeleteTravelPlan
);

router.delete(
    "/admin/:id",
    auth(UserRole.ADMIN),
    TravelPlanController.hardDeleteTravelPlan
);

export const travelPlanRoutes = router;