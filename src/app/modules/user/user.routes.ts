
import express, { NextFunction, Request, Response } from "express"
import { UserController } from "./user.controller";
import { fileUploader } from "../../helper/fileUploader";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.post(
    "/create-traveler",
    fileUploader.upload.single("file"),
    // UserController.createTraveler
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createTravelerValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createTraveler(req, res, next)
    }

)

export const userRoutes = router;