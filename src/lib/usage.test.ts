import { describe, expect, it } from "vitest";
import { canCreateComparison } from "@/lib/usage";

describe("usage limits", () => {
  it("allows free users below the three-comparison cap", () => {
    expect(canCreateComparison({ subscriptionStatus: "free", comparisonsUsed: 2 })).toBe(true);
  });

  it("blocks free users after three completed comparisons", () => {
    expect(canCreateComparison({ subscriptionStatus: "free", comparisonsUsed: 3 })).toBe(false);
  });

  it("allows pro users regardless of count", () => {
    expect(canCreateComparison({ subscriptionStatus: "pro", comparisonsUsed: 99 })).toBe(true);
  });
});
