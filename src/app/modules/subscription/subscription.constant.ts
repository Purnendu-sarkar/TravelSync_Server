import { SubscriptionPlan } from "../../../generated/prisma/enums";

export const subscriptionPlans = [
    {
        type: SubscriptionPlan.FREE,
        price: 0,
        duration: 'Lifetime (Limited)',
        stripePriceId: null,
    },
    {
        type: SubscriptionPlan.MONTHLY,
        price: 9.99,
        duration: '1 month',
        stripePriceId: 'price_1Sko4yC1BgyKBortYQSCEdcn',
    },
    {
        type: SubscriptionPlan.YEARLY,
        price: 99.99,
        duration: '1 year',
        stripePriceId: 'price_1Sko5IC1BgyKBorthK7mfEJd',
    },
];