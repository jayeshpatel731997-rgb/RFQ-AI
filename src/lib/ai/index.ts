import { OpenAIExtractionProvider } from "@/lib/ai/providers/openai";
import type { ExtractionProvider } from "@/lib/ai/providers/types";
import { getServerEnv } from "@/lib/env";

export function getExtractionProvider(): ExtractionProvider {
  const env = getServerEnv();

  switch (env.AI_PROVIDER) {
    case "openai":
      return new OpenAIExtractionProvider();
    default:
      throw new Error(`Unsupported AI provider: ${env.AI_PROVIDER}`);
  }
}
