export type SubscriptionStatus = "free" | "pro" | "past_due" | "canceled";

export interface UsageProfile {
  subscriptionStatus: SubscriptionStatus;
  comparisonsUsed: number;
}

const FREE_COMPARISON_LIMIT = 3;

export function canCreateComparison(profile: UsageProfile): boolean {
  return profile.subscriptionStatus === "pro" || profile.comparisonsUsed < FREE_COMPARISON_LIMIT;
}

export { FREE_COMPARISON_LIMIT };
