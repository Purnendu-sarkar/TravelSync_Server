
import express from "express"
import { UserController } from "./user.controller";

const router = express.Router();

router.post(
    "/create-traveler",
    UserController.createPatient

)

export const userRoutes = router;