import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireServerEnv } from "@/lib/env";

export async function GET(
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
    .select("name,file_path")
    .eq("comparison_id", id);
  const suppliers = (suppliersData ?? []) as unknown as Array<{
    name: string;
    file_path: string | null;
  }>;

  const bucket = requireServerEnv("SUPABASE_STORAGE_BUCKET");
  const signedFiles = await Promise.all(
    suppliers
      .filter(
        (supplier): supplier is { name: string; file_path: string } =>
          Boolean(supplier.file_path),
      )
      .map(async (supplier) => {
        const { data } = await admin.storage
          .from(bucket)
          .createSignedUrl(supplier.file_path, 60 * 5);

        return {
          supplierName: supplier.name,
          signedUrl: data?.signedUrl ?? null,
        };
      }),
  );

  return NextResponse.json({ files: signedFiles });
}
