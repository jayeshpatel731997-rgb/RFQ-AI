import { AppShell } from "@/components/app-shell";
import { ActiveComparisonPage } from "@/components/comparison/active-comparison-page";
import { requireUser } from "@/lib/supabase/auth";

export default async function ComparisonPage() {
  const user = await requireUser();

  return (
    <AppShell currentUserEmail={user.email}>
      <ActiveComparisonPage />
    </AppShell>
  );
}
