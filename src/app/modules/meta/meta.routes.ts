import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { MetaController } from "./meta.controller";

const router = express.Router();

router.get(
    "/",
    auth(UserRole.TRAVELER, UserRole.ADMIN),
    MetaController.getDashboardMeta
);

export const metaRoutes = router;