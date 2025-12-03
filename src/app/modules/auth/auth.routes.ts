import express from 'express'
import { AuthController } from './auth.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../generated/prisma/enums';


const router = express.Router();

router.get(
    "/me",
    AuthController.getMe
);

router.post(
    "/login",
    AuthController.login
)

router.post("/refresh-token", AuthController.refreshToken);
router.post("/change-password", auth(UserRole.TRAVELER, UserRole.ADMIN), AuthController.changePassword);
router.post("/forgot-password", AuthController.forgotPassword);

export const authRoutes = router;