import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canCreateComparison } from "@/lib/usage";
import { requireServerEnv } from "@/lib/env";
import { normalizeItemName } from "@/lib/matching";
import type {
  ComparisonRow,
  ComparisonSummary,
  SupplierQuote,
} from "@/types/rfq";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const quotes = JSON.parse(String(formData.get("quotes") ?? "[]")) as SupplierQuote[];
  const rows = JSON.parse(String(formData.get("rows") ?? "[]")) as ComparisonRow[];
  const summary = JSON.parse(String(formData.get("summary") ?? "{}")) as ComparisonSummary;
  const files = formData.getAll("files").filter((value): value is File => value instanceof File);

  if (!title) {
    return NextResponse.json({ error: "Comparison title is required." }, { status: 400 });
  }

  const { data: profileData } = await supabase
    .from("user_profiles")
    .select("subscription_status,comparisons_used")
    .eq("id", user.id)
    .maybeSingle();
  const profile = profileData as unknown as
    | {
        subscription_status: "free" | "pro" | "past_due" | "canceled";
        comparisons_used: number;
      }
    | null;

  const usageProfile = {
    subscriptionStatus: profile?.subscription_status ?? "free",
    comparisonsUsed: profile?.comparisons_used ?? 0,
  };

  if (!canCreateComparison(usageProfile)) {
    return NextResponse.json(
      { error: "You have reached the free comparison limit. Upgrade to Pro to continue." },
      { status: 402 },
    );
  }

  const comparisonId = randomUUID();
  // Supabase's generated table typings are intentionally loose in this starter app until
  // project-specific generated types are wired in from a live database.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = getSupabaseAdminClient() as any;
  const bucket = requireServerEnv("SUPABASE_STORAGE_BUCKET");

  // A completed comparison is the unit we monetize and persist. We only increment
  // usage after the result has been successfully stored.
  const { error: comparisonError } = await admin.from("comparisons").insert({
    id: comparisonId,
    user_id: user.id,
    title,
    status: "completed",
  });

  if (comparisonError) {
    return NextResponse.json({ error: comparisonError.message }, { status: 500 });
  }

  for (let index = 0; index < quotes.length; index += 1) {
    const quote = quotes[index];
    const file = files[index];
    const supplierId = randomUUID();
    let filePath: string | null = null;

    if (file) {
      filePath = `${user.id}/${comparisonId}/${file.name}`;
      const upload = await admin.storage.from(bucket).upload(filePath, file, {
        upsert: false,
        contentType: "application/pdf",
      });

      if (upload.error) {
        return NextResponse.json({ error: upload.error.message }, { status: 500 });
      }
    }

    const { error: supplierError } = await admin.from("suppliers").insert({
      id: supplierId,
      comparison_id: comparisonId,
      name: quote.supplierName,
      file_path: filePath,
      quote_number: quote.quoteNumber,
      quote_date: quote.quoteDate,
      currency: quote.currency,
      payment_terms: quote.paymentTerms,
      overall_lead_time: quote.overallLeadTime,
    });

    if (supplierError) {
      return NextResponse.json({ error: supplierError.message }, { status: 500 });
    }

    if (quote.lineItems.length > 0) {
      const { error: itemError } = await admin.from("line_items").insert(
        quote.lineItems.map((item) => ({
          id: randomUUID(),
          supplier_id: supplierId,
          item_name: item.itemName,
          normalized_item_name: normalizeItemName(item.itemName),
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total_price: item.totalPrice,
          unit_of_measure: item.unitOfMeasure,
          lead_time: item.leadTime,
          minimum_order_quantity: item.minimumOrderQuantity,
          notes: item.notes,
          confidence_score: item.confidenceScore,
        })),
      );

      if (itemError) {
        return NextResponse.json({ error: itemError.message }, { status: 500 });
      }
    }
  }

  const { error: resultsError } = await admin.from("comparison_results").insert({
    id: randomUUID(),
    comparison_id: comparisonId,
    result_json: { quotes, rows, summary },
  });

  if (resultsError) {
    return NextResponse.json({ error: resultsError.message }, { status: 500 });
  }

  await admin.from("user_profiles").upsert({
    id: user.id,
    email: user.email,
    subscription_status: usageProfile.subscriptionStatus,
    comparisons_used: usageProfile.comparisonsUsed + 1,
  });

  return NextResponse.json({ id: comparisonId });
}
