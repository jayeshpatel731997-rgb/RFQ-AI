import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ComparisonView } from "@/components/comparison/comparison-view";
import { SignedFilesPanel } from "@/components/comparison/signed-files-panel";
import { requireUser } from "@/lib/supabase/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { SavedComparisonPayload } from "@/types/rfq";

export default async function SavedComparisonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = getSupabaseAdminClient() as any;
  const { data: comparisonData } = await admin
    .from("comparisons")
    .select("id,user_id,title,created_at")
    .eq("id", id)
    .maybeSingle();
  const comparison = comparisonData as unknown as
    | { id: string; user_id: string; title: string; created_at: string }
    | null;

  if (!comparison || comparison.user_id !== user.id) {
    notFound();
  }

  const { data: resultData } = await admin
    .from("comparison_results")
    .select("result_json")
    .eq("comparison_id", id)
    .maybeSingle();
  const result = resultData as unknown as { result_json: unknown } | null;

  if (!result?.result_json) {
    notFound();
  }

  const payload = {
    id: comparison.id,
    title: comparison.title,
    createdAt: comparison.created_at,
    ...(result.result_json as Omit<SavedComparisonPayload, "id" | "title" | "createdAt">),
  };

  return (
    <AppShell currentUserEmail={user.email}>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">{payload.title}</h1>
        <p className="text-muted-foreground">
          Saved {new Date(payload.createdAt).toLocaleString()}
        </p>
      </div>
      <div className="mb-6">
        <SignedFilesPanel comparisonId={payload.id} />
      </div>
      <ComparisonView quotes={payload.quotes} rows={payload.rows} summary={payload.summary} />
    </AppShell>
  );
}
