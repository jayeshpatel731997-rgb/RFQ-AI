import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getOptionalUser() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getOptionalUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
