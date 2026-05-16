import { describe, expect, it } from "vitest";
import { buildExportRows } from "@/lib/export";
import type { ComparisonRow } from "@/types/rfq";

describe("export helpers", () => {
  it("flattens comparison rows for spreadsheet export", () => {
    const rows: ComparisonRow[] = [
      {
        normalizedItemName: "2 in pipe steel",
        displayName: "Steel Pipe 2 inch",
        bestPriceSupplier: "Beacon",
        bestLeadTimeSupplier: "Beacon",
        missingSuppliers: [],
        recommendation: "Best Price",
        suppliers: {
          Atlas: {
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
            confidenceScore: 0.9,
          },
          Beacon: {
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
        },
      },
    ];

    expect(buildExportRows(rows)).toEqual([
      {
        Item: "Steel Pipe 2 inch",
        Recommendation: "Best Price",
        "Atlas Unit Price": 8,
        "Atlas Quantity": 10,
        "Atlas UOM": "ea",
        "Atlas Lead Time": "10 days",
        "Beacon Unit Price": 7.5,
        "Beacon Quantity": 10,
        "Beacon UOM": "ea",
        "Beacon Lead Time": "7 days",
      },
    ]);
  });
});
