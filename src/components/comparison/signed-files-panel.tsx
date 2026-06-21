"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SignedFile {
  supplierName: string;
  signedUrl: string | null;
}

export function SignedFilesPanel({ comparisonId }: { comparisonId: string }) {
  const [files, setFiles] = useState<SignedFile[]>([]);

  useEffect(() => {
    let active = true;

    async function loadFiles() {
      const response = await fetch(`/api/comparisons/${comparisonId}/signed-files`);
      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as { files: SignedFile[] };
      if (active) {
        setFiles(payload.files);
      }
    }

    void loadFiles();

    return () => {
      active = false;
    };
  }, [comparisonId]);

  if (files.length === 0) {
    return null;
  }

  return (
    <Card className="no-print">
      <CardHeader>
        <CardTitle>Supplier PDFs</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        {files.map((file) =>
          file.signedUrl ? (
            <a
              key={file.supplierName}
              href={file.signedUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border px-3 py-2 text-sm hover:bg-muted"
            >
              Open {file.supplierName}
            </a>
          ) : null,
        )}
      </CardContent>
    </Card>
  );
}
