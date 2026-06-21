"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { type FileRejection, useDropzone } from "react-dropzone";
import { FileText, FlaskConical, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockQuotes } from "@/lib/mock-data";
import { useRfqSession } from "@/components/providers/rfq-session-provider";

const MAX_FILES = 5;
const MIN_FILES = 2;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export function UploadWorkflow() {
  const router = useRouter();
  const { files, setFiles, setQuotes } = useRfqSession();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        setError("Only PDF files up to 10 MB are allowed.");
        return;
      }

      const appendedFiles = acceptedFiles.map((file) => ({
        file,
        supplierName: file.name.replace(/\.pdf$/i, ""),
      }));
      const nextFiles = [...files, ...appendedFiles].slice(0, MAX_FILES);
      setFiles(nextFiles);
      setError(null);
    },
    [files, setFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: MAX_FILES,
    maxSize: MAX_FILE_SIZE_BYTES,
  });

  async function compareQuotes() {
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach(({ file, supplierName }) => {
        formData.append("files", file);
        formData.append("supplierNames", supplierName);
      });

      const response = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Unable to compare quotes.");
      }

      const payload = (await response.json()) as { quotes: typeof mockQuotes };
      setQuotes(payload.quotes);
      router.push("/review");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to compare quotes.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function useMockData() {
    setQuotes(mockQuotes);
    router.push("/review");
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload supplier quote PDFs</CardTitle>
          <CardDescription>
            Add 2–5 PDFs. Files are processed transiently and are not permanently stored in the
            initial extraction step.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div
            {...getRootProps()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center transition ${
              isDragActive ? "border-primary bg-primary/5" : "border-border bg-background"
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="mb-3 size-8 text-muted-foreground" />
            <p className="font-medium">Drag and drop PDFs here</p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
          </div>

          {files.length > 0 ? (
            <div className="grid gap-3">
              {files.map(({ file, supplierName }, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_220px]"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="size-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Input
                    value={supplierName}
                    onChange={(event) => {
                      const next = files.map((entry, entryIndex) =>
                        entryIndex === index
                          ? { ...entry, supplierName: event.target.value }
                          : entry,
                      );
                      setFiles(next);
                    }}
                    aria-label={`Supplier name for ${file.name}`}
                  />
                </div>
              ))}
            </div>
          ) : null}

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={compareQuotes}
              disabled={files.length < MIN_FILES || isSubmitting}
              className="sm:min-w-44"
            >
              {isSubmitting ? "Comparing..." : "Compare Quotes"}
            </Button>
            <Button onClick={useMockData} variant="outline" className="gap-2">
              <FlaskConical className="size-4" />
              Use mock sample data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
