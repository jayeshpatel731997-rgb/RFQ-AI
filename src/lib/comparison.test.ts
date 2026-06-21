import { describe, expect, it } from "vitest";
import { buildComparisonRows, buildComparisonSummary } from "@/lib/comparison";
import type { SupplierQuote } from "@/types/rfq";

const quotes: SupplierQuote[] = [
  {
    supplierName: "Atlas",
    quoteNumber: null,
    quoteDate: null,
    currency: "USD",
    paymentTerms: "Net 30",
    overallLeadTime: "10 days",
    lineItems: [
      {
        id: "a1",
        itemName: "Steel Pipe 2 inch",
        description: null,
        quantity: 10,
        unitPrice: 8,
        totalPrice: 80,
        unitOfMeasure: "ea",
        leadTime: "10 days",
        minimumOrderQuantity: null,
        notes: null,
        confidenceScore: 0.92,
      },
    ],
  },
  {
    supplierName: "Beacon",
    quoteNumber: null,
    quoteDate: null,
    currency: "USD",
    paymentTerms: "Net 15",
    overallLeadTime: "7 days",
    lineItems: [
      {
        id: "b1",
        itemName: "2-inch steel pipe",
        description: null,
        quantity: 10,
        unitPrice: 7.5,
        totalPrice: 75,
        unitOfMeasure: "ea",
        leadTime: "7 days",
        minimumOrderQuantity: null,
        notes: null,
        confidenceScore: 0.96,
      },
    ],
  },
];

describe("comparison builders", () => {
  it("builds recommendation rows with best price and best lead time", () => {
    const rows = buildComparisonRows(quotes);
    expect(rows[0].recommendation).toBe("Best Price");
    expect(rows[0].bestPriceSupplier).toBe("Beacon");
    expect(rows[0].bestLeadTimeSupplier).toBe("Beacon");
  });

  it("summarizes totals, fastest supplier, and low-confidence counts", () => {
    const summary = buildComparisonSummary([
      {
        ...quotes[0],
        lineItems: quotes[0].lineItems.map((item) => ({
          ...item,
          confidenceScore: 0.72,
        })),
      },
      quotes[1],
    ]);
    expect(summary.bestOverallSupplierByPrice).toBe("Beacon");
    expect(summary.fastestSupplier).toBe("Beacon");
    expect(summary.lowConfidenceRows).toBe(1);
    expect(summary.totalEstimatedCostBySupplier).toEqual({
      Atlas: 80,
      Beacon: 75,
    });
  });
});
