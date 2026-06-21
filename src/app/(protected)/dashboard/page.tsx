import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const [{ data: comparisonsData }, { data: profileData }] = await Promise.all([
    supabase
      .from("comparisons")
      .select("id,title,status,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("user_profiles")
      .select("subscription_status,comparisons_used")
      .eq("id", user.id)
      .maybeSingle(),
  ]);
  const comparisons = (comparisonsData ?? []) as Array<{
    id: string;
    title: string;
    status: string;
    created_at: string;
  }>;
  const profile = profileData as unknown as
    | { subscription_status: string; comparisons_used: number; stripe_customer_id?: string | null }
    | null;

  return (
    <AppShell currentUserEmail={user.email}>
      <div className="grid gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Subscription: {profile?.subscription_status ?? "free"} · Comparisons used:{" "}
              {profile?.comparisons_used ?? 0}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/upload">
              <Button>New comparison</Button>
            </Link>
            {profile?.stripe_customer_id ? (
              <form action="/api/stripe/portal" method="post">
                <Button variant="outline">Manage billing</Button>
              </form>
            ) : (
              <Link href="/pricing">
                <Button variant="outline">Manage plan</Button>
              </Link>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Past comparisons</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {comparisons.length > 0 ? (
              comparisons.map((comparison) => (
                <Link
                  key={comparison.id}
                  href={`/comparisons/${comparison.id}`}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{comparison.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(comparison.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">{comparison.status}</span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No saved comparisons yet. Start with your first upload.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
