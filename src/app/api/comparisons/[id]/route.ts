import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireServerEnv } from "@/lib/env";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = getSupabaseAdminClient() as any;
  const { data: comparisonData } = await admin
    .from("comparisons")
    .select("id,user_id")
    .eq("id", id)
    .maybeSingle();
  const comparison = comparisonData as unknown as { id: string; user_id: string } | null;

  if (!comparison || comparison.user_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: suppliersData } = await admin
    .from("suppliers")
    .select("file_path")
    .eq("comparison_id", id);
  const suppliers = (suppliersData ?? []) as unknown as Array<{ file_path: string | null }>;
  const filePaths = suppliers
    .map((supplier) => supplier.file_path)
    .filter((path): path is string => Boolean(path));

  if (filePaths.length > 0) {
    await admin.storage.from(requireServerEnv("SUPABASE_STORAGE_BUCKET")).remove(filePaths);
  }

  await admin.from("comparisons").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
