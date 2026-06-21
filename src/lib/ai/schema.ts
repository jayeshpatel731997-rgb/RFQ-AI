import { z } from "zod";
import type { SupplierQuote } from "@/types/rfq";

const extractionLineItemSchema = z.object({
  item_name: z.string().min(1),
  description: z.string().nullable(),
  quantity: z.number().nullable(),
  unit_price: z.number().nullable(),
  total_price: z.number().nullable(),
  unit_of_measure: z.string().nullable(),
  lead_time: z.string().nullable(),
  minimum_order_quantity: z.number().nullable(),
  notes: z.string().nullable(),
  confidence_score: z.number().min(0).max(1),
});

const extractionResponseSchema = z.object({
  supplier_name: z.string().nullable(),
  quote_number: z.string().nullable(),
  quote_date: z.string().nullable(),
  currency: z.string().nullable(),
  payment_terms: z.string().nullable(),
  overall_lead_time: z.string().nullable(),
  line_items: z.array(extractionLineItemSchema),
});

export type ExtractionResponse = z.infer<typeof extractionResponseSchema>;

export function parseExtractionResponse(input: unknown): SupplierQuote {
  const parsed = extractionResponseSchema.parse(input);

  return {
    supplierName: parsed.supplier_name ?? "Unknown Supplier",
    quoteNumber: parsed.quote_number,
    quoteDate: parsed.quote_date,
    currency: parsed.currency,
    paymentTerms: parsed.payment_terms,
    overallLeadTime: parsed.overall_lead_time,
    lineItems: parsed.line_items.map((item, index) => ({
      id: `${parsed.supplier_name ?? "supplier"}-${index + 1}`,
      itemName: item.item_name,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      totalPrice: item.total_price,
      unitOfMeasure: item.unit_of_measure,
      leadTime: item.lead_time,
      minimumOrderQuantity: item.minimum_order_quantity,
      notes: item.notes,
      confidenceScore: item.confidence_score,
    })),
  };
}
