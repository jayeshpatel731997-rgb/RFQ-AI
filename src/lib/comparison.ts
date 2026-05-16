import {
  compareLeadTimes,
  compareUnitPrices,
  detectMissingItems,
  matchSimilarItems,
} from "@/lib/matching";
import type {
  ComparisonRow,
  ComparisonSummary,
  LineItem,
  SupplierQuote,
} from "@/types/rfq";

const LOW_CONFIDENCE_THRESHOLD = 0.8;

function supplierForItemId(
  quotes: SupplierQuote[],
  itemId: string | null,
): string | null {
  if (!itemId) {
    return null;
  }

  for (const quote of quotes) {
    if (quote.lineItems.some((item) => item.id === itemId)) {
      return quote.supplierName;
    }
  }

  return null;
}

function recommendationForRow(
  items: LineItem[],
  missingSuppliers: string[],
  bestPriceSupplier: string | null,
  bestLeadTimeSupplier: string | null,
  needsReview: boolean,
) {
  if (
    needsReview ||
    items.some((item) => item.confidenceScore < LOW_CONFIDENCE_THRESHOLD)
  ) {
    return "Needs Review" as const;
  }

  if (missingSuppliers.length > 0) {
    return "Missing Data" as const;
  }

  if (bestPriceSupplier) {
    return "Best Price" as const;
  }

  if (bestLeadTimeSupplier) {
    return "Best Lead Time" as const;
  }

  return "Missing Data" as const;
}

export function buildComparisonRows(quotes: SupplierQuote[]): ComparisonRow[] {
  return matchSimilarItems(quotes).map((group) => {
    const items = group.items.map((entry) => entry.item);
    const bestPriceId = compareUnitPrices(items);
    const bestLeadTimeId = compareLeadTimes(items);
    const missingSuppliers = detectMissingItems(group, quotes);
    const bestPriceSupplier = supplierForItemId(quotes, bestPriceId);
    const bestLeadTimeSupplier = supplierForItemId(quotes, bestLeadTimeId);

    return {
      normalizedItemName: group.normalizedItemName,
      displayName: group.displayName,
      suppliers: Object.fromEntries(
        quotes.map((quote) => [
          quote.supplierName,
          group.items.find((entry) => entry.supplierName === quote.supplierName)?.item ??
            null,
        ]),
      ),
      bestPriceSupplier,
      bestLeadTimeSupplier,
      missingSuppliers,
      recommendation: recommendationForRow(
        items,
        missingSuppliers,
        bestPriceSupplier,
        bestLeadTimeSupplier,
        group.needsReview,
      ),
    };
  });
}

function supplierLeadTimeDays(quote: SupplierQuote): number | null {
  const leadTimes = quote.lineItems
    .map((item) => item.leadTime)
    .filter((value): value is string => Boolean(value))
    .map((value) => {
      const match = value.toLowerCase().match(/(\d+(?:\.\d+)?)\s*(day|days|week|weeks)/);
      if (!match) {
        return Number.POSITIVE_INFINITY;
      }

      return Number(match[1]) * (match[2].startsWith("week") ? 7 : 1);
    })
    .filter((value) => Number.isFinite(value));

  if (leadTimes.length === 0) {
    return null;
  }

  return Math.min(...leadTimes);
}

export function buildComparisonSummary(quotes: SupplierQuote[]): ComparisonSummary {
  const rows = buildComparisonRows(quotes);
  const totalEstimatedCostBySupplier = Object.fromEntries(
    quotes.map((quote) => [
      quote.supplierName,
      quote.lineItems.reduce((sum, item) => {
        if (item.quantity === null || item.unitPrice === null) {
          return sum;
        }

        return sum + item.quantity * item.unitPrice;
      }, 0),
    ]),
  );

  const bestOverallSupplierByPrice =
    Object.entries(totalEstimatedCostBySupplier).sort(([, left], [, right]) => left - right)[0]?.[0] ??
    null;

  const fastestSupplier =
    quotes
      .map((quote) => ({
        supplierName: quote.supplierName,
        leadTimeDays: supplierLeadTimeDays(quote),
      }))
      .filter(
        (entry): entry is { supplierName: string; leadTimeDays: number } =>
          entry.leadTimeDays !== null,
      )
      .sort((left, right) => left.leadTimeDays - right.leadTimeDays)[0]?.supplierName ??
    null;

  return {
    bestOverallSupplierByPrice,
    fastestSupplier,
    missingItemsBySupplier: Object.fromEntries(
      quotes.map((quote) => [
        quote.supplierName,
        rows.filter((row) => row.missingSuppliers.includes(quote.supplierName)).length,
      ]),
    ),
    lowConfidenceRows: quotes
      .flatMap((quote) => quote.lineItems)
      .filter((item) => item.confidenceScore < LOW_CONFIDENCE_THRESHOLD).length,
    totalEstimatedCostBySupplier,
  };
}
