import { AppShell } from "@/components/app-shell";
import { ReviewWorkflow } from "@/components/review/review-workflow";
import { requireUser } from "@/lib/supabase/auth";

export default async function ReviewPage() {
  const user = await requireUser();

  return (
    <AppShell currentUserEmail={user.email}>
      <ReviewWorkflow />
    </AppShell>
  );
}
