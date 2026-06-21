import type { LineItem, MatchedGroup, SupplierQuote } from "@/types/rfq";

const UNIT_ALIASES: Record<string, string> = {
  inch: "in",
  inches: "in",
  '"': "in",
};

const LEAD_TIME_UNITS: Record<string, number> = {
  day: 1,
  days: 1,
  week: 7,
  weeks: 7,
};

export function normalizeItemName(value: string): string {
  const tokens = value
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/[,“”,]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((token) => UNIT_ALIASES[token] ?? token)
    .filter(Boolean);

  const dimensionTokens: string[] = [];
  const wordTokens: string[] = [];

  tokens.forEach((token, index) => {
    if (/^\d+(\.\d+)?$/.test(token) && tokens[index + 1] === "in") {
      dimensionTokens.push(token, "in");
      return;
    }

    if (token === "in" && /^\d+(\.\d+)?$/.test(tokens[index - 1] ?? "")) {
      return;
    }

    wordTokens.push(token);
  });

  return [...dimensionTokens, ...wordTokens.sort()].join(" ");
}

function tokenSet(value: string): Set<string> {
  return new Set(value.split(" "));
}

function jaccardSimilarity(left: string, right: string): number {
  const leftSet = tokenSet(left);
  const rightSet = tokenSet(right);
  const intersection = [...leftSet].filter((token) => rightSet.has(token)).length;
  const union = new Set([...leftSet, ...rightSet]).size;
  return union === 0 ? 0 : intersection / union;
}

export function matchSimilarItems(quotes: SupplierQuote[]): MatchedGroup[] {
  const groups: MatchedGroup[] = [];

  quotes.forEach((quote) => {
    quote.lineItems.forEach((item) => {
      // Keep the auto-matcher deliberately conservative so procurement users review
      // ambiguous merges instead of trusting a false positive.
      const normalized = normalizeItemName(item.itemName);
      const existing = groups.find((group) => {
        const similarity = jaccardSimilarity(group.normalizedItemName, normalized);
        return group.normalizedItemName === normalized || similarity >= 0.85;
      });

      if (existing) {
        existing.items.push({ supplierName: quote.supplierName, item });
        return;
      }

      groups.push({
        normalizedItemName: normalized,
        displayName: item.itemName,
        items: [{ supplierName: quote.supplierName, item }],
        needsReview: false,
      });
    });
  });

  return groups.map((group) => {
    const uniqueNormalizedNames = new Set(
      group.items.map(({ item }) => normalizeItemName(item.itemName)),
    );
    return {
      ...group,
      needsReview: uniqueNormalizedNames.size > 1,
    };
  });
}

export function compareUnitPrices(items: LineItem[]): string | null {
  let bestId: string | null = null;
  let bestPrice = Number.POSITIVE_INFINITY;

  items.forEach((item) => {
    if (item.unitPrice === null) {
      return;
    }

    if (item.unitPrice < bestPrice) {
      bestId = item.id;
      bestPrice = item.unitPrice;
    }
  });

  return bestId;
}

function parseLeadTimeDays(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const match = value.toLowerCase().match(/(\d+(?:\.\d+)?)\s*(day|days|week|weeks)/);
  if (!match) {
    return null;
  }

  return Number(match[1]) * LEAD_TIME_UNITS[match[2]];
}

export function compareLeadTimes(items: LineItem[]): string | null {
  let bestId: string | null = null;
  let bestDays = Number.POSITIVE_INFINITY;

  items.forEach((item) => {
    const days = parseLeadTimeDays(item.leadTime);
    if (days === null) {
      return;
    }

    if (days < bestDays) {
      bestId = item.id;
      bestDays = days;
    }
  });

  return bestId;
}

export function detectMissingItems(group: MatchedGroup, quotes: SupplierQuote[]): string[] {
  const presentSuppliers = new Set(group.items.map((entry) => entry.supplierName));
  return quotes
    .map((quote) => quote.supplierName)
    .filter((supplierName) => !presentSuppliers.has(supplierName));
}
