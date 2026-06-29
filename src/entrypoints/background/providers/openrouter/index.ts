import ky, { HTTPError } from 'ky';
import { TRANSLATE_TEXT_ERROR_CODE } from '@/shared/translation';
import { createTranslationMessages } from '../../translation/translationPrompt';
import { validateProviderConfig } from '../validateProviderConfig';
import {
  OPENROUTER_CHAT_COMPLETIONS_URL,
  OPENROUTER_REQUEST_TIMEOUT_MS,
  OPENROUTER_RETRY_LIMIT,
  OPENROUTER_RETRY_METHODS,
  OPENROUTER_RETRY_STATUS_CODES,
} from './openrouter.constants';
import type {
  OpenRouterChatCompletionData,
  OpenRouterChatCompletionResponse,
  OpenRouterChatCompletionResult,
  OpenRouterProviderConfig,
} from './openrouter.types';
import { openRouterChatCompletionResponseSchema } from './openrouter.schemas';
import type {
  ProviderTranslateInput,
  ProviderTranslateResult,
  TranslationProvider,
} from '../types';

export class OpenRouterProvider implements TranslationProvider {
  constructor(private readonly config: OpenRouterProviderConfig) {}

  async translate(
    input: ProviderTranslateInput,
  ): Promise<ProviderTranslateResult> {
    const configError = validateProviderConfig({
      provider: 'openrouter',
      ...this.config,
    });

    if (configError) {
      return configError;
    }

    const data = this.createRequestData(input);
    const response = await this.fetchChatCompletion(data);

    if (!response.ok) {
      return response;
    }

    const translatedText = getOpenRouterMessageContent(
      response.parsedProviderResponse,
    );

    if (!translatedText) {
      return {
        ok: false,
        error: {
          code: TRANSLATE_TEXT_ERROR_CODE.emptyProviderResponse,
          message: 'OpenRouter response did not include translated text.',
          provider: 'openrouter',
          modelId: this.config.modelId,
        },
      };
    }

    return {
      ok: true,
      translatedText,
      provider: 'openrouter',
      modelId: this.config.modelId,
      rawProviderResponse: response.rawProviderResponse,
    };
  }

  private createRequestData(
    input: ProviderTranslateInput,
  ): OpenRouterChatCompletionData {
    return {
      model: this.config.modelId,
      messages: createTranslationMessages(input),
    };
  }

  private async fetchChatCompletion(
    data: OpenRouterChatCompletionData,
  ): Promise<OpenRouterChatCompletionResult> {
    try {
      const rawProviderResponse = await ky
        .post(OPENROUTER_CHAT_COMPLETIONS_URL, {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
          },
          json: {
            ...data,
            stream: false,
          },
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
        return {
          ok: false,
          error: {
            code: TRANSLATE_TEXT_ERROR_CODE.invalidProviderResponse,
            message: 'OpenRouter response has unexpected format.',
            provider: 'openrouter',
            modelId: this.config.modelId,
          },
        };
      }

      return {
        ok: true,
        rawProviderResponse,
        parsedProviderResponse: parsedProviderResponse.data,
      };
    } catch (error) {
      if (error instanceof HTTPError) {
        return {
          ok: false,
          error: {
            code: TRANSLATE_TEXT_ERROR_CODE.providerRequestFailed,
            message: `OpenRouter request failed with status ${error.response.status}.`,
            provider: 'openrouter',
            modelId: this.config.modelId,
          },
        };
      }

      return {
        ok: false,
        error: {
          code: TRANSLATE_TEXT_ERROR_CODE.providerRequestFailed,
          message: 'OpenRouter request failed.',
          provider: 'openrouter',
          modelId: this.config.modelId,
        },
      };
    }
  }
}

function getOpenRouterMessageContent(
  response: OpenRouterChatCompletionResponse,
): string {
  return response.choices[0]?.message.content.trim() ?? '';
}
