import { prisma } from "../../../lib/prisma";
import { SubscriptionPlan, UserRole } from "../../../generated/prisma/enums";
import { IJWTPayload } from "../../types/common";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { subscriptionPlans } from "./subscription.constant";
import Stripe from "stripe";
import config from "../../config";
import { Request } from "express";

const stripe = new Stripe(config.stripe.secret_key as string);


const getPlans = async () => {
    return subscriptionPlans;
};

const createCheckoutSession = async (user: IJWTPayload, planType: SubscriptionPlan) => {
    if (user.role !== UserRole.TRAVELER) {
        throw new ApiError(httpStatus.FORBIDDEN, "Only travelers can subscribe");
    }

    const traveler = await prisma.traveler.findUniqueOrThrow({ where: { email: user.email } });

    // Prevent subscribing to FREE
    if (planType === SubscriptionPlan.FREE) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Cannot subscribe to FREE plan");
    }

    // Check if already subscribed
    if (traveler.subscriptionPlan && traveler.subscriptionEnd && traveler.subscriptionEnd > new Date()) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You already have an active subscription");
    }

    const plan = subscriptionPlans.find(p => p.type === planType);
    if (!plan) {
        throw new ApiError(httpStatus.NOT_FOUND, "Invalid plan type");
    }

    if (!plan.stripePriceId) {
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Stripe price ID not configured for this plan"
        );
    }


    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
            {
                price: plan.stripePriceId,
                quantity: 1,
            },
        ],
        success_url: `${config.client_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.client_url}/payment/cancel`,

        // 🔥 ADD THIS
        metadata: {
            travelerId: traveler.id,
            planType: plan.type, // MONTHLY | YEARLY
        },
    });


    console.log(session)

    return {
        sessionId: session.id,
        url: session.url
    };
};

const getMySubscriptionStatus = async (user: IJWTPayload) => {
    const traveler = await prisma.traveler.findUniqueOrThrow({
        where: { email: user.email },
        select: {
            subscriptionPlan: true,
            subscriptionStart: true,
            subscriptionEnd: true,
            isVerified: true,
        },
    });

    const now = new Date();
    const isActive = traveler.subscriptionEnd && traveler.subscriptionEnd > now;

    let currentPlan = traveler.subscriptionPlan || 'FREE';
    if (!isActive) {
        currentPlan = 'FREE';
    }

    return {
        plan: currentPlan,
        start: traveler.subscriptionStart,
        end: traveler.subscriptionEnd,
        isActive,
        isVerified: isActive ? traveler.isVerified : false,
    };
};

const handleWebhook = async (req: Request) => {
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
        console.log('Webhook received - Verifying signature...');
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            config.stripe.webhook_secret as string
        );
        console.log('Webhook verified - Event type:', event.type);
    } catch (err: any) {
        console.error('Signature verification failed:', err.message);
        // throw new ApiError(httpStatus.BAD_REQUEST, `Webhook Error: ${err.message}`);
        return;
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const travelerId = session.metadata?.travelerId;
        const planType = session.metadata?.planType as SubscriptionPlan;

        if (!travelerId || !planType) {
            console.error("Missing metadata", session.metadata);
            return;
        }

        const now = new Date();
        const endDate = new Date(now);

        if (planType === SubscriptionPlan.MONTHLY) {
            endDate.setMonth(endDate.getMonth() + 1);
        } else if (planType === SubscriptionPlan.YEARLY) {
            endDate.setFullYear(endDate.getFullYear() + 1);
        }

        await prisma.$transaction(async (tx) => {
            await tx.traveler.update({
                where: { id: travelerId },
                data: {
                    subscriptionPlan: planType,
                    subscriptionStart: now,
                    subscriptionEnd: endDate,
                    isVerified: true,
                },
            });

            await tx.payment.create({
                data: {
                    travelerId,
                    amount: session.amount_total
                        ? session.amount_total / 100
                        : 0,
                    plan: planType,
                    status: "succeeded",
                    transactionId: session.id,
                },
            });
        });

        console.log("✅ Subscription activated for:", travelerId);
    }
};

export const SubscriptionService = {
    getPlans,
    createCheckoutSession,
    getMySubscriptionStatus,
    handleWebhook,
};