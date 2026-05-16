import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { getOptionalUser } from "@/lib/supabase/auth";

export default async function HomePage() {
  const user = await getOptionalUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <AppShell>
      <section className="mx-auto flex max-w-3xl flex-col gap-6 py-16">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Procurement comparison
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Turn supplier quote PDFs into a clear buying decision.
        </h1>
        <p className="text-lg text-muted-foreground">
          Upload 2–5 quote PDFs, review the extracted line items, compare suppliers side by side,
          and export the result to Excel or PDF.
        </p>
        <div className="flex gap-3">
          <Link href="/login">
            <Button size="lg">Get started</Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline">
              View pricing
            </Button>
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
