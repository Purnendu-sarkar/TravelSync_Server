
import express from "express"
import { UserController } from "./user.controller";

const router = express.Router();

router.post(
    "/create-traveler",
    UserController.createTraveler

)

export const userRoutes = router;