import type { z } from 'zod';
import type { geminiGenerateContentResponseSchema } from './gemini.schemas';
import type { ProviderResponseResult } from '../types';

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
  ProviderResponseResult<GeminiGenerateContentResponse>;

export type GeminiGenerateContentResponse = z.infer<
  typeof geminiGenerateContentResponseSchema
>;
