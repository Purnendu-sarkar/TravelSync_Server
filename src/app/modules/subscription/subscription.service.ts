import { subscriptionPlans } from "./subscription.constant";

const getPlans = async () => {
    return subscriptionPlans;
};

export const SubscriptionService = {
    getPlans,
};