import express from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { travelPlanRoutes } from '../modules/travelPlan/travelPlan.routes';


const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/auth',
        route: authRoutes
    },
    {
        path: '/travel-plan',
        route: travelPlanRoutes
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;