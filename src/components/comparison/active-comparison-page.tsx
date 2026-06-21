"use client";

import { ComparisonView } from "@/components/comparison/comparison-view";
import { Card, CardContent } from "@/components/ui/card";
import { useRfqSession } from "@/components/providers/rfq-session-provider";

export function ActiveComparisonPage() {
  const { quotes, rows, summary } = useRfqSession();

  if (!summary || rows.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          No active comparison found. Generate one from the review page first.
        </CardContent>
      </Card>
    );
  }

  return <ComparisonView quotes={quotes} rows={rows} summary={summary} />;
}
