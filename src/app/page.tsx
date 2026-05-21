import { redirect } from "next/navigation";
import { CaseStudyPage } from "@/components/case-study/case-study-page";
import { getOptionalUser } from "@/lib/supabase/auth";

export default async function HomePage() {
  const user = await getOptionalUser();

  if (user) {
    redirect("/dashboard");
  }

  return <CaseStudyPage />;
}
