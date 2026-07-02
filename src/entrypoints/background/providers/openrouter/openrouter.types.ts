import type { ChatCompletionMessage } from '../../translation/translationPrompt';
import type { z } from 'zod';
import type { openRouterChatCompletionResponseSchema } from './openrouter.schemas';
import type { ProviderResponseResult } from '../types';

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
  ProviderResponseResult<OpenRouterChatCompletionResponse>;

export type OpenRouterChatCompletionResponse = z.infer<
  typeof openRouterChatCompletionResponseSchema
>;
