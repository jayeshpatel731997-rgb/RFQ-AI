import { describe, expect, it } from "vitest";
import {
  compareLeadTimes,
  compareUnitPrices,
  detectMissingItems,
  matchSimilarItems,
  normalizeItemName,
} from "@/lib/matching";
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
        confidenceScore: 0.98,
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
        confidenceScore: 0.95,
      },
    ],
  },
];

describe("matching utilities", () => {
  it("normalizes equivalent item names consistently", () => {
    expect(normalizeItemName("Steel Pipe 2 inch")).toBe("2 in pipe steel");
    expect(normalizeItemName("Pipe, steel, 2 in")).toBe("2 in pipe steel");
  });

  it("groups conservative near-identical item names", () => {
    const groups = matchSimilarItems(quotes);
    expect(groups).toHaveLength(1);
    expect(groups[0].normalizedItemName).toBe("2 in pipe steel");
    expect(groups[0].items).toHaveLength(2);
  });

  it("finds the lowest numeric unit price", () => {
    expect(compareUnitPrices(quotes.flatMap((quote) => quote.lineItems))).toBe("b1");
  });

  it("finds the fastest lead time from textual durations", () => {
    expect(compareLeadTimes(quotes.flatMap((quote) => quote.lineItems))).toBe("b1");
  });

  it("detects which suppliers are missing a matched item", () => {
    const onlyAtlas = [{ ...quotes[0], supplierName: "Atlas" }, { ...quotes[1], lineItems: [] }];
    const groups = matchSimilarItems(onlyAtlas);
    expect(detectMissingItems(groups[0], onlyAtlas)).toEqual(["Beacon"]);
  });
});
