import type { z } from 'zod';
import type { openAIResponsesResponseSchema } from './openai.schemas';
import type { ProviderResponseResult } from '../types';

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
  ProviderResponseResult<OpenAIResponsesResponse>;

export type OpenAIResponsesResponse = z.infer<
  typeof openAIResponsesResponseSchema
>;
