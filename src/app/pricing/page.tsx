import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOptionalUser } from "@/lib/supabase/auth";

export default async function PricingPage() {
  const user = await getOptionalUser();

  return (
    <AppShell currentUserEmail={user?.email}>
      <div className="mx-auto grid max-w-4xl gap-6 py-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>For first comparisons and evaluation.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p className="text-4xl font-semibold">$0</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>3 completed comparisons total</li>
              <li>PDF review, matching, export</li>
              <li>Private storage after signup</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <CardDescription>For ongoing procurement work.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p className="text-4xl font-semibold">$99/month</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Unlimited completed comparisons</li>
              <li>Saved history and private files</li>
              <li>Self-serve billing portal</li>
            </ul>
            {user ? (
              <form action="/api/stripe/checkout" method="post">
                <Button className="w-full">Upgrade to Pro</Button>
              </form>
            ) : (
              <Link href="/signup">
                <Button className="w-full">Create account</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
