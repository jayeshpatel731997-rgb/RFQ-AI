import { parseExtractionResponse } from "@/lib/ai/schema";
import type {
  ExtractionInput,
  ExtractionProvider,
} from "@/lib/ai/providers/types";
import type { SupplierQuote } from "@/types/rfq";

export async function extractWithRepair(
  provider: ExtractionProvider,
  input: ExtractionInput,
): Promise<SupplierQuote> {
  const firstResponse = await provider.extract(input);

  try {
    return parseExtractionResponse(JSON.parse(firstResponse));
  } catch {
    const repairedResponse = await provider.extract({
      ...input,
      repairJson: firstResponse,
    });

    try {
      return parseExtractionResponse(JSON.parse(repairedResponse));
    } catch {
      throw new Error(
        "We could not read one of the quote files. Please try again or use mock sample data.",
      );
    }
  }
}
