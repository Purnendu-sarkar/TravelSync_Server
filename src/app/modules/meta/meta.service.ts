import { prisma } from "../../../lib/prisma";
import { PlanStatus, RequestStatus, SubscriptionPlan, UserRole, UserStatus } from "../../../generated/prisma/client";
import { IJWTPayload } from "../../types/common";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { ReviewService } from "../review/review.service";

const getDashboardMeta = async (user: IJWTPayload) => {
    if (user.role === UserRole.ADMIN) {
        return await getAdminDashboardMeta();
    } else if (user.role === UserRole.TRAVELER) {
        return await getTravelerDashboardMeta(user);
    } else {
        throw new ApiError(httpStatus.FORBIDDEN, "Invalid role for dashboard access");
    }
};

const getAdminDashboardMeta = async () => {
    // Total Active Travelers
    const totalTravelers = await prisma.traveler.count({
        where: {
            isDeleted: false,
            user: { status: UserStatus.ACTIVE },
        },
    });

    // Total Travel Plans (Pending + Ongoing)
    const totalActivePlans = await prisma.travelPlan.count({
        where: {
            isDeleted: false,
            status: { in: [PlanStatus.PENDING, PlanStatus.ONGOING] },
        },
    });

    // Total Completed Plans
    const totalCompletedPlans = await prisma.travelPlan.count({
        where: {
            isDeleted: false,
            status: PlanStatus.COMPLETED,
        },
    });

    // Total Reviews
    const totalReviews = await prisma.review.count();

    // Average Rating Across All Travelers
    const allReviews = await prisma.review.findMany();
    const avgRating =
        allReviews.length > 0
            ? Number((allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1))
            : 0;

    // Subscription Stats
    const subscriptionStats = await prisma.traveler.groupBy({
        by: ["subscriptionPlan"],
        _count: { subscriptionPlan: true },
        where: { subscriptionPlan: { not: null } },
    });

    // Payment Stats
    const totalPayments = await prisma.payment.count();
    const totalRevenue = await prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "succeeded" },
    });

    // Recent Activity
    const recentPlans = await prisma.travelPlan.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
            traveler: { select: { name: true, email: true } },
        },
    });

    const recentReviews = await prisma.review.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
            reviewer: { select: { name: true } },
            travelPlan: { select: { destination: true } },
        },
    });

    return {
        overview: {
            totalTravelers,
            totalActivePlans,
            totalCompletedPlans,
            totalReviews,
            avgRating,
            totalPayments,
            totalRevenue: totalRevenue._sum.amount || 0,
        },
        subscriptionStats: subscriptionStats.map((stat) => ({
            plan: stat.subscriptionPlan,
            count: stat._count.subscriptionPlan,
        })),
        recentActivity: {
            plans: recentPlans,
            reviews: recentReviews,
        },
    };
};

const getTravelerDashboardMeta = async (user: IJWTPayload) => {
    const traveler = await prisma.traveler.findUniqueOrThrow({
        where: { email: user.email },
    });

    // My Travel Plans
    const myPlansCount = await prisma.travelPlan.count({
        where: { travelerId: traveler.id, isDeleted: false },
    });

    const pendingPlans = await prisma.travelPlan.count({
        where: {
            travelerId: traveler.id,
            status: PlanStatus.PENDING,
            isDeleted: false,
        },
    });

    const ongoingPlans = await prisma.travelPlan.count({
        where: {
            travelerId: traveler.id,
            status: PlanStatus.ONGOING,
            isDeleted: false,
        },
    });

    const completedPlans = await prisma.travelPlan.count({
        where: {
            travelerId: traveler.id,
            status: PlanStatus.COMPLETED,
            isDeleted: false,
        },
    });

    // My Requests
    const sentRequestsCount = await prisma.travelBuddyRequest.count({
        where: { requesterId: traveler.id },
    });

    const pendingRequests = await prisma.travelBuddyRequest.count({
        where: {
            requesterId: traveler.id,
            status: RequestStatus.PENDING,
        },
    });

    const acceptedRequests = await prisma.travelBuddyRequest.count({
        where: {
            requesterId: traveler.id,
            status: RequestStatus.ACCEPTED,
        },
    });

    // Received Requests (for my plans)
    const receivedRequestsCount = await prisma.travelBuddyRequest.count({
        where: { travelPlan: { travelerId: traveler.id } },
    });

    // Reviews
    const { avgRating, totalReviews, reviews } = await ReviewService.getMyReceivedReviews(user);

    // Subscription Status
    const now = new Date();
    const isSubscribed = traveler.subscriptionPlan !== SubscriptionPlan.FREE &&
        traveler.subscriptionEnd && traveler.subscriptionEnd > now;

    const subscriptionDetails = {
        plan: traveler.subscriptionPlan || SubscriptionPlan.FREE,
        start: traveler.subscriptionStart,
        end: traveler.subscriptionEnd,
        isActive: isSubscribed,
    };

    // Recent Activity
    const recentPlans = await prisma.travelPlan.findMany({
        where: { travelerId: traveler.id, isDeleted: false },
        take: 5,
        orderBy: { createdAt: "desc" },
    });

    const recentRequests = await prisma.travelBuddyRequest.findMany({
        where: { requesterId: traveler.id },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { travelPlan: { select: { destination: true } } },
    });

    return {
        overview: {
            myPlansCount,
            pendingPlans,
            ongoingPlans,
            completedPlans,
            sentRequestsCount,
            pendingRequests,
            acceptedRequests,
            receivedRequestsCount,
            avgRating,
            totalReviews,
        },
        subscription: subscriptionDetails,
        recentActivity: {
            plans: recentPlans,
            requests: recentRequests,
            reviews: reviews.slice(0, 5), // Recent 5 reviews
        },
    };
};

export const MetaService = {
    getDashboardMeta,
};