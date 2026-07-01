import type { TranslateTextFailure } from '@/shared/translation';
import type { z } from 'zod';
import type { openAIResponsesResponseSchema } from './openai.schemas';

export type OpenAIProviderConfig = {
  apiKey: string;
  modelId: string;
};

export type OpenAIResponsesRequestBody = {
  model: string;
  instructions: string;
  input: string;
};

export type OpenAIResponsesResult =
  | {
      ok: true;
      rawProviderResponse: unknown;
      parsedProviderResponse: OpenAIResponsesResponse;
    }
  | TranslateTextFailure;

export type OpenAIResponsesResponse = z.infer<
  typeof openAIResponsesResponseSchema
>;
