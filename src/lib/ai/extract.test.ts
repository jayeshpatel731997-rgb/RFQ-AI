import { describe, expect, it } from "vitest";
import { extractWithRepair } from "@/lib/ai/extract";
import type { ExtractionProvider } from "@/lib/ai/providers/types";

describe("extractWithRepair", () => {
  it("retries once with repair when the first model response is invalid JSON", async () => {
    let attempts = 0;
    const provider: ExtractionProvider = {
      async extract() {
        attempts += 1;
        return attempts === 1
          ? "not-json"
          : JSON.stringify({
              supplier_name: "Atlas",
              quote_number: null,
              quote_date: null,
              currency: null,
              payment_terms: null,
              overall_lead_time: null,
              line_items: [],
            });
      },
    };

    const result = await extractWithRepair(provider, {
      filename: "quote.pdf",
      base64Pdf: "ZmFrZQ==",
      supplierName: "Atlas",
    });

    expect(result.supplierName).toBe("Atlas");
    expect(attempts).toBe(2);
  });
});
