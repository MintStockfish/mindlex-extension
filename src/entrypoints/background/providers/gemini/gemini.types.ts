import type { TranslateTextFailure } from '@/shared/translation';
import type { z } from 'zod';
import type { geminiGenerateContentResponseSchema } from './gemini.schemas';

export type GeminiProviderConfig = {
  apiKey: string;
  modelId: string;
};

export type GeminiGenerateContentRequestBody = {
  systemInstruction: {
    parts: Array<{
      text: string;
    }>;
  };
  contents: Array<{
    role: 'user';
    parts: Array<{
      text: string;
    }>;
  }>;
};

export type GeminiGenerateContentResult =
  | {
      ok: true;
      rawProviderResponse: unknown;
      parsedProviderResponse: GeminiGenerateContentResponse;
    }
  | TranslateTextFailure;

export type GeminiGenerateContentResponse = z.infer<
  typeof geminiGenerateContentResponseSchema
>;
