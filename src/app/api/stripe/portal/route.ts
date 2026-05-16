import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getStripeClient } from "@/lib/stripe";
import { requireServerEnv } from "@/lib/env";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { data: profileData } = await supabase
    .from("user_profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();
  const profile = profileData as unknown as { stripe_customer_id: string | null } | null;

  if (!profile?.stripe_customer_id) {
    return NextResponse.redirect(new URL("/pricing", request.url));
  }

  const session = await getStripeClient().billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${requireServerEnv("NEXT_PUBLIC_APP_URL")}/dashboard`,
  });

  return NextResponse.redirect(session.url, 303);
}
