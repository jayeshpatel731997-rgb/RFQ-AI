export interface ExtractionInput {
  filename: string;
  base64Pdf: string;
  supplierName: string;
  repairJson?: string;
}

export interface ExtractionProvider {
  extract(input: ExtractionInput): Promise<string>;
}
