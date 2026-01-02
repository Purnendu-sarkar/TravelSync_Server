import express from "express";
import { SubscriptionController } from "./subscription.controller";

const router = express.Router();

router.get("/plans", SubscriptionController.getPlans);


export const subscriptionRoutes = router;