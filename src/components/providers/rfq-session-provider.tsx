"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type {
  ComparisonRow,
  ComparisonSummary,
  SupplierQuote,
} from "@/types/rfq";

interface UploadedSupplierFile {
  file: File;
  supplierName: string;
}

interface RfqSessionContextValue {
  files: UploadedSupplierFile[];
  quotes: SupplierQuote[];
  rows: ComparisonRow[];
  summary: ComparisonSummary | null;
  title: string;
  setFiles: (files: UploadedSupplierFile[]) => void;
  setQuotes: (quotes: SupplierQuote[]) => void;
  setComparison: (rows: ComparisonRow[], summary: ComparisonSummary) => void;
  setTitle: (title: string) => void;
  reset: () => void;
}

const RfqSessionContext = createContext<RfqSessionContextValue | null>(null);

export function RfqSessionProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<UploadedSupplierFile[]>([]);
  const [quotes, setQuotes] = useState<SupplierQuote[]>([]);
  const [rows, setRows] = useState<ComparisonRow[]>([]);
  const [summary, setSummary] = useState<ComparisonSummary | null>(null);
  const [title, setTitle] = useState("");

  const value = useMemo(
    () => ({
      files,
      quotes,
      rows,
      summary,
      title,
      setFiles,
      setQuotes,
      setComparison(nextRows: ComparisonRow[], nextSummary: ComparisonSummary) {
        setRows(nextRows);
        setSummary(nextSummary);
      },
      setTitle,
      reset() {
        setFiles([]);
        setQuotes([]);
        setRows([]);
        setSummary(null);
        setTitle("");
      },
    }),
    [files, quotes, rows, summary, title],
  );

  return <RfqSessionContext.Provider value={value}>{children}</RfqSessionContext.Provider>;
}

export function useRfqSession() {
  const context = useContext(RfqSessionContext);

  if (!context) {
    throw new Error("useRfqSession must be used within RfqSessionProvider");
  }

  return context;
}
