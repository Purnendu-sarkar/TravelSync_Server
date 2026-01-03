import express from "express";
import { ReviewController } from "./review.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/", auth(UserRole.TRAVELER), ReviewController.createReview);
router.get("/me", auth(UserRole.TRAVELER), ReviewController.getMyReviews);
router.get("/public", ReviewController.getPublicReviews);

export const reviewRoutes = router;