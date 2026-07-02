import ky, { HTTPError } from 'ky';
import { createTranslationMessages } from '../../translation/translationPrompt';
import { BaseTranslationProvider } from '../baseTranslationProvider';
import {
  createInvalidProviderResponseError,
  createProviderRequestFailedError,
} from '../providerErrors';
import {
  OPENROUTER_CHAT_COMPLETIONS_URL,
  OPENROUTER_REQUEST_TIMEOUT_MS,
  OPENROUTER_RETRY_LIMIT,
  OPENROUTER_RETRY_METHODS,
  OPENROUTER_RETRY_STATUS_CODES,
} from './openrouter.constants';
import type {
  OpenRouterChatCompletionResponse,
  OpenRouterChatCompletionRequestBody,
  OpenRouterChatCompletionResult,
  OpenRouterProviderConfig,
} from './openrouter.types';
import { openRouterChatCompletionResponseSchema } from './openrouter.schemas';
import type { ProviderTranslateInput } from '../types';

export class OpenRouterProvider extends BaseTranslationProvider<
  OpenRouterChatCompletionRequestBody,
  OpenRouterChatCompletionResponse
> {
  protected readonly provider = 'openrouter';

  constructor(protected readonly config: OpenRouterProviderConfig) {
    super();
  }

  protected createRequestBody(
    input: ProviderTranslateInput,
  ): OpenRouterChatCompletionRequestBody {
    return {
      model: this.config.modelId,
      messages: createTranslationMessages(input),
      stream: false,
    };
  }

  protected async fetchProviderResponse(
    body: OpenRouterChatCompletionRequestBody,
  ): Promise<OpenRouterChatCompletionResult> {
    try {
      const rawProviderResponse = await ky
        .post(OPENROUTER_CHAT_COMPLETIONS_URL, {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
          },
          json: body,
          retry: {
            limit: OPENROUTER_RETRY_LIMIT,
            methods: [...OPENROUTER_RETRY_METHODS],
            statusCodes: [...OPENROUTER_RETRY_STATUS_CODES],
          },
          timeout: OPENROUTER_REQUEST_TIMEOUT_MS,
        })
        .json<unknown>();
      const parsedProviderResponse =
        openRouterChatCompletionResponseSchema.safeParse(rawProviderResponse);

      if (!parsedProviderResponse.success) {
        return createInvalidProviderResponseError({
          provider: this.provider,
          modelId: this.config.modelId,
        });
      }

      return {
        ok: true,
        rawProviderResponse,
        parsedProviderResponse: parsedProviderResponse.data,
      };
    } catch (error) {
      if (error instanceof HTTPError) {
        return createProviderRequestFailedError({
          provider: this.provider,
          modelId: this.config.modelId,
          status: error.response.status,
        });
      }

      return createProviderRequestFailedError({
        provider: this.provider,
        modelId: this.config.modelId,
      });
    }
  }

  protected extractTranslatedText(
    response: OpenRouterChatCompletionResponse,
  ): string {
    return response.choices[0]?.message.content ?? '';
  }
}
