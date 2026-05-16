import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <AppShell>
      <div className="grid gap-4 py-12">
        <AuthForm mode="login" />
        <p className="text-center text-sm text-muted-foreground">
          Need an account?{" "}
          <Link href="/signup" className="font-medium text-foreground">
            Sign up
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
