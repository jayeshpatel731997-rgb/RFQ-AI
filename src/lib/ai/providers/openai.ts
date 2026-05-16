import OpenAI from "openai";
import { getServerEnv } from "@/lib/env";
import { EXTRACTION_PROMPT, REPAIR_PROMPT } from "@/lib/ai/prompt";
import type { ExtractionInput, ExtractionProvider } from "@/lib/ai/providers/types";

let client: OpenAI | null = null;

function getClient() {
  if (!client) {
    const env = getServerEnv();
    client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }

  return client;
}

export class OpenAIExtractionProvider implements ExtractionProvider {
  async extract(input: ExtractionInput): Promise<string> {
    const env = getServerEnv();
    const content = input.repairJson
      ? [
          {
            type: "input_text" as const,
            text: `${REPAIR_PROMPT}\n\n${input.repairJson}`,
          },
        ]
      : [
          {
            type: "input_file" as const,
            filename: input.filename,
            file_data: input.base64Pdf,
          },
          {
            type: "input_text" as const,
            text: `${EXTRACTION_PROMPT}\n\nSupplier name hint: ${input.supplierName}`,
          },
        ];

    const response = await getClient().responses.create({
      model: env.OPENAI_MODEL,
      input: [{ role: "user", content }],
    });

    return response.output_text;
  }
}
