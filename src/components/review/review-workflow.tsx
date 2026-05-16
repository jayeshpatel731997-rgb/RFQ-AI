"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { useRfqSession } from "@/components/providers/rfq-session-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { buildComparisonRows, buildComparisonSummary } from "@/lib/comparison";
import type { LineItem, SupplierQuote } from "@/types/rfq";

function updateItem(
  quotes: SupplierQuote[],
  supplierIndex: number,
  itemIndex: number,
  patch: Partial<LineItem>,
) {
  return quotes.map((quote, quoteIndex) =>
    quoteIndex === supplierIndex
      ? {
          ...quote,
          lineItems: quote.lineItems.map((item, currentItemIndex) =>
            currentItemIndex === itemIndex ? { ...item, ...patch } : item,
          ),
        }
      : quote,
  );
}

function numberOrNull(value: string) {
  return value === "" ? null : Number(value);
}

export function ReviewWorkflow() {
  const router = useRouter();
  const { quotes, setQuotes, files, setComparison, title, setTitle } = useRfqSession();
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const lowConfidenceCount = useMemo(
    () =>
      quotes.flatMap((quote) => quote.lineItems).filter((item) => item.confidenceScore < 0.8)
        .length,
    [quotes],
  );

  async function generateComparison() {
    if (!title.trim()) {
      setError("Please enter a comparison title before generating.");
      return;
    }

    const rows = buildComparisonRows(quotes);
    const summary = buildComparisonSummary(quotes);
    setComparison(rows, summary);
    setIsSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("quotes", JSON.stringify(quotes));
      formData.append("rows", JSON.stringify(rows));
      formData.append("summary", JSON.stringify(summary));
      files.forEach(({ file }) => formData.append("files", file));

      const response = await fetch("/api/comparisons", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Unable to save comparison.");
      }

      router.push("/comparison");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save comparison.");
    } finally {
      setIsSaving(false);
    }
  }

  if (quotes.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          No extracted quote data yet. Start from the upload page.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Review extracted data</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="comparison-title" className="text-sm font-medium">
              Comparison title
            </label>
            <Input
              id="comparison-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="May 2026 valve package"
            />
          </div>
          {lowConfidenceCount > 0 ? (
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
              <AlertCircle className="size-4" />
              {lowConfidenceCount} low-confidence row{lowConfidenceCount === 1 ? "" : "s"} need
              attention.
            </div>
          ) : null}
        </CardContent>
      </Card>

      {quotes.map((quote, supplierIndex) => (
        <Card key={quote.supplierName}>
          <CardHeader>
            <CardTitle>
              <Input
                value={quote.supplierName}
                onChange={(event) =>
                  setQuotes(
                    quotes.map((entry, index) =>
                      index === supplierIndex
                        ? { ...entry, supplierName: event.target.value }
                        : entry,
                    ),
                  )
                }
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {quote.lineItems.map((item, itemIndex) => (
              <div
                key={item.id}
                className={`grid gap-3 rounded-xl border p-4 ${
                  item.confidenceScore < 0.8 ? "border-amber-300 bg-amber-50/60" : ""
                }`}
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    value={item.itemName}
                    onChange={(event) =>
                      setQuotes(
                        updateItem(quotes, supplierIndex, itemIndex, {
                          itemName: event.target.value,
                        }),
                      )
                    }
                    placeholder="Item name"
                  />
                  <Input
                    value={item.description ?? ""}
                    onChange={(event) =>
                      setQuotes(
                        updateItem(quotes, supplierIndex, itemIndex, {
                          description: event.target.value || null,
                        }),
                      )
                    }
                    placeholder="Description"
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-4">
                  <Input
                    value={item.quantity ?? ""}
                    onChange={(event) =>
                      setQuotes(
                        updateItem(quotes, supplierIndex, itemIndex, {
                          quantity: numberOrNull(event.target.value),
                        }),
                      )
                    }
                    placeholder="Quantity"
                  />
                  <Input
                    value={item.unitPrice ?? ""}
                    onChange={(event) =>
                      setQuotes(
                        updateItem(quotes, supplierIndex, itemIndex, {
                          unitPrice: numberOrNull(event.target.value),
                        }),
                      )
                    }
                    placeholder="Unit price"
                  />
                  <Input
                    value={item.totalPrice ?? ""}
                    onChange={(event) =>
                      setQuotes(
                        updateItem(quotes, supplierIndex, itemIndex, {
                          totalPrice: numberOrNull(event.target.value),
                        }),
                      )
                    }
                    placeholder="Total price"
                  />
                  <Input
                    value={item.unitOfMeasure ?? ""}
                    onChange={(event) =>
                      setQuotes(
                        updateItem(quotes, supplierIndex, itemIndex, {
                          unitOfMeasure: event.target.value || null,
                        }),
                      )
                    }
                    placeholder="UOM"
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <Input
                    value={item.leadTime ?? ""}
                    onChange={(event) =>
                      setQuotes(
                        updateItem(quotes, supplierIndex, itemIndex, {
                          leadTime: event.target.value || null,
                        }),
                      )
                    }
                    placeholder="Lead time"
                  />
                  <Input
                    value={item.minimumOrderQuantity ?? ""}
                    onChange={(event) =>
                      setQuotes(
                        updateItem(quotes, supplierIndex, itemIndex, {
                          minimumOrderQuantity: numberOrNull(event.target.value),
                        }),
                      )
                    }
                    placeholder="MOQ"
                  />
                  <Input
                    value={quote.paymentTerms ?? ""}
                    onChange={(event) =>
                      setQuotes(
                        quotes.map((entry, index) =>
                          index === supplierIndex
                            ? { ...entry, paymentTerms: event.target.value || null }
                            : entry,
                        ),
                      )
                    }
                    placeholder="Payment terms"
                  />
                </div>
                <Textarea
                  value={item.notes ?? ""}
                  onChange={(event) =>
                    setQuotes(
                      updateItem(quotes, supplierIndex, itemIndex, {
                        notes: event.target.value || null,
                      }),
                    )
                  }
                  placeholder="Notes"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button onClick={generateComparison} disabled={isSaving} className="w-fit">
        {isSaving ? "Generating..." : "Generate Comparison"}
      </Button>
    </div>
  );
}
