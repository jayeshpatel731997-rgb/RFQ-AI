import * as XLSX from "xlsx";
import type {
  ComparisonRow,
  ComparisonSummary,
  SupplierQuote,
} from "@/types/rfq";

export function buildExportRows(rows: ComparisonRow[]) {
  return rows.map((row) => {
    const flattened: Record<string, string | number | null> = {
      Item: row.displayName,
      Recommendation: row.recommendation,
    };

    Object.entries(row.suppliers).forEach(([supplierName, item]) => {
      flattened[`${supplierName} Unit Price`] = item?.unitPrice ?? null;
      flattened[`${supplierName} Quantity`] = item?.quantity ?? null;
      flattened[`${supplierName} UOM`] = item?.unitOfMeasure ?? null;
      flattened[`${supplierName} Lead Time`] = item?.leadTime ?? null;
    });

    return flattened;
  });
}

export function exportComparisonWorkbook(
  quotes: SupplierQuote[],
  rows: ComparisonRow[],
  summary: ComparisonSummary,
) {
  const workbook = XLSX.utils.book_new();

  const summaryRows = [
    { Metric: "Best overall supplier by price", Value: summary.bestOverallSupplierByPrice },
    { Metric: "Supplier with fastest lead time", Value: summary.fastestSupplier },
    { Metric: "Low-confidence rows", Value: summary.lowConfidenceRows },
    ...quotes.map((quote) => ({
      Metric: `${quote.supplierName} missing items`,
      Value: summary.missingItemsBySupplier[quote.supplierName] ?? 0,
    })),
    ...quotes.map((quote) => ({
      Metric: `${quote.supplierName} estimated total`,
      Value: summary.totalEstimatedCostBySupplier[quote.supplierName] ?? 0,
    })),
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(summaryRows),
    "Summary",
  );
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(buildExportRows(rows)),
    "Comparison",
  );

  return workbook;
}
