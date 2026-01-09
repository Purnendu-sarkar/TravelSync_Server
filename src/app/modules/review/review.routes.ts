import express from "express";
import { ReviewController } from "./review.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.get("/given", auth(UserRole.TRAVELER), ReviewController.getMyGivenReviews);
router.get("/me", auth(UserRole.TRAVELER), ReviewController.getMyReviews);
router.get("/public", ReviewController.getPublicReviews);

router.post("/", auth(UserRole.TRAVELER), ReviewController.createReview);

router.patch("/:id", auth(UserRole.TRAVELER), ReviewController.updateReview);


export const reviewRoutes = router;