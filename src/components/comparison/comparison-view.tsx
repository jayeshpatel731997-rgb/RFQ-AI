"use client";

import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SummaryCards } from "@/components/comparison/summary-cards";
import { exportComparisonWorkbook } from "@/lib/export";
import type {
  ComparisonRow,
  ComparisonSummary,
  SupplierQuote,
} from "@/types/rfq";

export function ComparisonView({
  quotes,
  rows,
  summary,
}: {
  quotes: SupplierQuote[];
  rows: ComparisonRow[];
  summary: ComparisonSummary;
}) {
  function downloadExcel() {
    const workbook = exportComparisonWorkbook(quotes, rows, summary);
    XLSX.writeFile(workbook, "rfq-comparison.xlsx");
  }

  return (
    <div className="grid gap-6">
      <SummaryCards summary={summary} />
      <div className="no-print flex gap-3">
        <Button onClick={downloadExcel}>Export Excel</Button>
        <Button onClick={() => window.print()} variant="outline">
          Print / Export PDF
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              {quotes.map((quote) => (
                <TableHead key={quote.supplierName}>{quote.supplierName}</TableHead>
              ))}
              <TableHead>Recommendation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.normalizedItemName}>
                <TableCell className="font-medium">{row.displayName}</TableCell>
                {quotes.map((quote) => {
                  const item = row.suppliers[quote.supplierName];
                  const isBestPrice = row.bestPriceSupplier === quote.supplierName;
                  const isBestLead = row.bestLeadTimeSupplier === quote.supplierName;

                  return (
                    <TableCell
                      key={quote.supplierName}
                      className={
                        isBestPrice
                          ? "bg-emerald-50"
                          : isBestLead
                            ? "bg-sky-50"
                            : undefined
                      }
                    >
                      {item ? (
                        <div className="space-y-1 text-sm">
                          <div>${item.unitPrice ?? "—"}</div>
                          <div>
                            {item.quantity ?? "—"} {item.unitOfMeasure ?? ""}
                          </div>
                          <div>{item.leadTime ?? "—"}</div>
                        </div>
                      ) : (
                        <Badge variant="destructive">Missing</Badge>
                      )}
                    </TableCell>
                  );
                })}
                <TableCell>
                  <Badge variant={row.recommendation === "Needs Review" ? "secondary" : "outline"}>
                    {row.recommendation}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
