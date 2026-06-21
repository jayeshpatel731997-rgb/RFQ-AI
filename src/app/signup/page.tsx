import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return (
    <AppShell>
      <div className="grid gap-4 py-12">
        <AuthForm mode="signup" />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground">
            Login
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
