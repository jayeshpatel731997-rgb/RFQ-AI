import { AppShell } from "@/components/app-shell";
import { UploadWorkflow } from "@/components/upload/upload-workflow";
import { requireUser } from "@/lib/supabase/auth";

export default async function UploadPage() {
  const user = await requireUser();

  return (
    <AppShell currentUserEmail={user.email}>
      <UploadWorkflow />
    </AppShell>
  );
}
