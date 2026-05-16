import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ComparisonSummary } from "@/types/rfq";

export function SummaryCards({ summary }: { summary: ComparisonSummary }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Best overall supplier
          </CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">
          {summary.bestOverallSupplierByPrice ?? "—"}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Fastest lead time
          </CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">
          {summary.fastestSupplier ?? "—"}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Missing items
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          {Object.entries(summary.missingItemsBySupplier).map(([supplier, count]) => (
            <div key={supplier} className="flex justify-between gap-4">
              <span>{supplier}</span>
              <span className="font-medium">{count}</span>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Low-confidence rows
          </CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">{summary.lowConfidenceRows}</CardContent>
      </Card>
    </div>
  );
}
