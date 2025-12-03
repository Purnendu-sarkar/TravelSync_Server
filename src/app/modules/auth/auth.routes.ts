import express from 'express'
import { AuthController } from './auth.controller';


const router = express.Router();

router.get(
    "/me",
    AuthController.getMe
);

router.post(
    "/login",
    AuthController.login
)

export const authRoutes = router;