import type { ChatCompletionMessage } from '../../translation/translationPrompt';
import type { TranslateTextFailure } from '@/shared/translation';
import type { z } from 'zod';
import type { openRouterChatCompletionResponseSchema } from './openrouter.schemas';

export type OpenRouterProviderConfig = {
  apiKey: string;
  modelId: string;
};

export type OpenRouterChatCompletionRequestBody = {
  model: string;
  messages: ChatCompletionMessage[];
  stream: false;
};

export type OpenRouterChatCompletionResult =
  | {
      ok: true;
      rawProviderResponse: unknown;
      parsedProviderResponse: OpenRouterChatCompletionResponse;
    }
  | TranslateTextFailure;

export type OpenRouterChatCompletionResponse = z.infer<
  typeof openRouterChatCompletionResponseSchema
>;
