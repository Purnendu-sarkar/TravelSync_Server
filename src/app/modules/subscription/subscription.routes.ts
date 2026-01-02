import express from "express";
import { SubscriptionController } from "./subscription.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.get("/plans", SubscriptionController.getPlans);

router.post(
    "/create-checkout",
    auth(UserRole.TRAVELER),
    SubscriptionController.createCheckoutSession
);

router.get(
    "/my-status",
    auth(UserRole.TRAVELER),
    SubscriptionController.getMySubscriptionStatus
);


export const subscriptionRoutes = router;