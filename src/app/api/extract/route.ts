import { NextResponse } from "next/server";
import { extractWithRepair } from "@/lib/ai/extract";
import { getExtractionProvider } from "@/lib/ai";
import { requireServerEnv } from "@/lib/env";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    requireServerEnv("OPENAI_API_KEY");
    const formData = await request.formData();
    const files = formData.getAll("files").filter((value): value is File => value instanceof File);
    const supplierNames = formData
      .getAll("supplierNames")
      .map((value) => String(value));

    if (files.length < 2 || files.length > 5) {
      return NextResponse.json(
        { error: "Please upload between 2 and 5 PDF files." },
        { status: 400 },
      );
    }

    if (
      files.some(
        (file) => file.type !== "application/pdf" || file.size > MAX_FILE_SIZE_BYTES,
      )
    ) {
      return NextResponse.json(
        { error: "Only PDF files up to 10 MB are allowed." },
        { status: 400 },
      );
    }

    // PDFs are converted in memory and sent directly to the provider; they are not
    // written to disk during the extraction step.
    const provider = getExtractionProvider();
    const quotes = await Promise.all(
      files.map(async (file, index) => {
        const bytes = Buffer.from(await file.arrayBuffer());
        return extractWithRepair(provider, {
          filename: file.name,
          supplierName: supplierNames[index] ?? file.name.replace(/\.pdf$/i, ""),
          base64Pdf: bytes.toString("base64"),
        });
      }),
    );

    return NextResponse.json({ quotes });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to extract quote data from the PDFs.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
