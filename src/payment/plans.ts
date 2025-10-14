import { requireNodeEnvVar } from "../server/utils";

export type SubscriptionStatus =
  | "past_due"
  | "cancel_at_period_end"
  | "active"
  | "deleted";

export enum PaymentPlanId {
  Hobby = "hobby",
  Pro = "pro",
  Credits5 = "credits5",
}

export interface PaymentPlan {
  // Returns the id under which this payment plan is identified on your payment processor.
  // E.g. this might be price id on Stripe, or variant id on LemonSqueezy.
  getPaymentProcessorPlanId: () => string;
  effect: PaymentPlanEffect;
}

export type PaymentPlanEffect =
  | { kind: "subscription" }
  | { kind: "credits"; amount: number };

export const paymentPlans: Record<PaymentPlanId, PaymentPlan> = {
  [PaymentPlanId.Hobby]: {
    getPaymentProcessorPlanId: () =>
      requireNodeEnvVar("PAYMENTS_HOBBY_SUBSCRIPTION_PLAN_ID"),
    effect: { kind: "subscription" },
  },
  [PaymentPlanId.Pro]: {
    getPaymentProcessorPlanId: () =>
      requireNodeEnvVar("PAYMENTS_PRO_SUBSCRIPTION_PLAN_ID"),
    effect: { kind: "subscription" },
  },
  [PaymentPlanId.Credits5]: {
    getPaymentProcessorPlanId: () =>
      requireNodeEnvVar("PAYMENTS_CREDITS_5_PLAN_ID"),
    effect: { kind: "credits", amount: 5 },
  },
};

export function prettyPaymentPlanName(planId: PaymentPlanId): string {
  const planToName: Record<PaymentPlanId, string> = {
    [PaymentPlanId.Hobby]: "Hobby",
    [PaymentPlanId.Pro]: "Pro",
    [PaymentPlanId.Credits5]: "5 Credits",
  };
  return planToName[planId];
}

export function parsePaymentPlanId(planId: string): PaymentPlanId {
  if ((Object.values(PaymentPlanId) as string[]).includes(planId)) {
    return planId as PaymentPlanId;
  } else {
    throw new Error(`Invalid PaymentPlanId: ${planId}`);
  }
}

export function getSubscriptionPaymentPlanIds(): PaymentPlanId[] {
  return Object.values(PaymentPlanId).filter(
    (planId) => paymentPlans[planId].effect.kind === "subscription",
  );
}
