export type Recommendation =
  | "Best Price"
  | "Best Lead Time"
  | "Missing Data"
  | "Needs Review";

export interface LineItem {
  id: string;
  itemName: string;
  description: string | null;
  quantity: number | null;
  unitPrice: number | null;
  totalPrice: number | null;
  unitOfMeasure: string | null;
  leadTime: string | null;
  minimumOrderQuantity: number | null;
  notes: string | null;
  confidenceScore: number;
}

export interface SupplierQuote {
  supplierName: string;
  quoteNumber: string | null;
  quoteDate: string | null;
  currency: string | null;
  paymentTerms: string | null;
  overallLeadTime: string | null;
  lineItems: LineItem[];
}

export interface MatchedGroup {
  normalizedItemName: string;
  displayName: string;
  items: Array<{
    supplierName: string;
    item: LineItem;
  }>;
  needsReview: boolean;
}

export interface ComparisonRow {
  normalizedItemName: string;
  displayName: string;
  suppliers: Record<string, LineItem | null>;
  bestPriceSupplier: string | null;
  bestLeadTimeSupplier: string | null;
  missingSuppliers: string[];
  recommendation: Recommendation;
}

export interface ComparisonSummary {
  bestOverallSupplierByPrice: string | null;
  fastestSupplier: string | null;
  missingItemsBySupplier: Record<string, number>;
  lowConfidenceRows: number;
  totalEstimatedCostBySupplier: Record<string, number>;
}

export interface SavedComparisonPayload {
  id: string;
  title: string;
  createdAt: string;
  quotes: SupplierQuote[];
  rows: ComparisonRow[];
  summary: ComparisonSummary;
}
