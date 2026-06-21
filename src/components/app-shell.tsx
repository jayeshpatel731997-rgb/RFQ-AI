import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AppShell({
  children,
  currentUserEmail,
}: {
  children: React.ReactNode;
  currentUserEmail?: string | null;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="no-print border-b bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            RFQ Quote Comparison AI
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            {currentUserEmail ? (
              <>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                  Dashboard
                </Link>
                <form action="/auth/logout" method="post">
                  <Button type="submit" variant="outline" size="sm">
                    Logout
                  </Button>
                </form>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm">Login</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
