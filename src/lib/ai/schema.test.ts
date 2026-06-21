import { describe, expect, it } from "vitest";
import { parseExtractionResponse } from "@/lib/ai/schema";

describe("AI extraction schema", () => {
  it("accepts valid extracted quote payloads", () => {
    const result = parseExtractionResponse({
      supplier_name: "Atlas",
      quote_number: "Q-1",
      quote_date: "2026-05-16",
      currency: "USD",
      payment_terms: "Net 30",
      overall_lead_time: "10 days",
      line_items: [
        {
          item_name: "Steel Pipe 2 inch",
          description: null,
          quantity: 10,
          unit_price: 8,
          total_price: 80,
          unit_of_measure: "ea",
          lead_time: "10 days",
          minimum_order_quantity: null,
          notes: null,
          confidence_score: 0.9,
        },
      ],
    });

    expect(result.lineItems[0].itemName).toBe("Steel Pipe 2 inch");
  });

  it("rejects confidence scores outside 0 to 1", () => {
    expect(() =>
      parseExtractionResponse({
        supplier_name: "Atlas",
        quote_number: null,
        quote_date: null,
        currency: null,
        payment_terms: null,
        overall_lead_time: null,
        line_items: [
          {
            item_name: "Steel Pipe",
            description: null,
            quantity: null,
            unit_price: null,
            total_price: null,
            unit_of_measure: null,
            lead_time: null,
            minimum_order_quantity: null,
            notes: null,
            confidence_score: 1.4,
          },
        ],
      }),
    ).toThrow();
  });
});
