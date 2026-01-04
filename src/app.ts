import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import config from './config';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import { SubscriptionController } from './app/modules/subscription/subscription.controller';

const app: Application = express();
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://travel-sync-five.vercel.app',
        'https://travel-sync-frontend-sandy.vercel.app'
    ],
    credentials: true
}));

app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    SubscriptionController.webhook
);
//parser
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

app.get('/', (req: Request, res: Response) => {
    res.send({
        message: "🧳✈️⛱️ TravelSync Server is running 💥💥💥",
        environment: config.node_env,
        uptime: process.uptime().toFixed(2) + "sec",
        timeStamp: new Date().toUTCString()
    })
});


app.use(globalErrorHandler);

app.use(notFound);

export default app;