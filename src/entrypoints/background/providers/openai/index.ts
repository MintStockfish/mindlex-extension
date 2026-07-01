import ky, { HTTPError } from 'ky';
import { TRANSLATE_TEXT_ERROR_CODE } from '@/shared/translation';
import {
  createTranslationInput,
  createTranslationInstructions,
} from '../../translation/translationPrompt';
import { validateProviderConfig } from '../validateProviderConfig';
import {
  OPENAI_REQUEST_TIMEOUT_MS,
  OPENAI_RESPONSES_URL,
  OPENAI_RETRY_LIMIT,
  OPENAI_RETRY_METHODS,
  OPENAI_RETRY_STATUS_CODES,
} from './openai.constants';
import { openAIResponsesResponseSchema } from './openai.schemas';
import type {
  OpenAIProviderConfig,
  OpenAIResponsesRequestBody,
  OpenAIResponsesResponse,
  OpenAIResponsesResult,
} from './openai.types';
import type {
  ProviderTranslateInput,
  ProviderTranslateResult,
  TranslationProvider,
} from '../types';

export class OpenAiProvider implements TranslationProvider {
  constructor(private readonly config: OpenAIProviderConfig) {}

  async translate(
    input: ProviderTranslateInput,
  ): Promise<ProviderTranslateResult> {
    const configError = validateProviderConfig({
      provider: 'openai',
      ...this.config,
    });

    if (configError) {
      return configError;
    }

    const body = this.createRequestBody(input);
    const response = await this.fetchResponse(body);

    if (!response.ok) {
      return response;
    }

    const translatedText = getOpenAIOutputText(response.parsedProviderResponse);

    if (!translatedText) {
      return {
        ok: false,
        error: {
          code: TRANSLATE_TEXT_ERROR_CODE.emptyProviderResponse,
          message: 'OpenAI response did not include translated text.',
          provider: 'openai',
          modelId: this.config.modelId,
        },
      };
    }

    return {
      ok: true,
      translatedText,
      provider: 'openai',
      modelId: this.config.modelId,
      rawProviderResponse: response.rawProviderResponse,
    };
  }

  private createRequestBody(
    input: ProviderTranslateInput,
  ): OpenAIResponsesRequestBody {
    return {
      model: this.config.modelId,
      instructions: createTranslationInstructions(),
      input: createTranslationInput(input),
    };
  }

  private async fetchResponse(
    body: OpenAIResponsesRequestBody,
  ): Promise<OpenAIResponsesResult> {
    try {
      const rawProviderResponse = await ky
        .post(OPENAI_RESPONSES_URL, {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
          },
          json: body,
          retry: {
            limit: OPENAI_RETRY_LIMIT,
            methods: [...OPENAI_RETRY_METHODS],
            statusCodes: [...OPENAI_RETRY_STATUS_CODES],
          },
          timeout: OPENAI_REQUEST_TIMEOUT_MS,
        })
        .json<unknown>();
      const parsedProviderResponse =
        openAIResponsesResponseSchema.safeParse(rawProviderResponse);

      if (!parsedProviderResponse.success) {
        return {
          ok: false,
          error: {
            code: TRANSLATE_TEXT_ERROR_CODE.invalidProviderResponse,
            message: 'OpenAI response has unexpected format.',
            provider: 'openai',
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
            message: `OpenAI request failed with status ${error.response.status}.`,
            provider: 'openai',
            modelId: this.config.modelId,
          },
        };
      }

      return {
        ok: false,
        error: {
          code: TRANSLATE_TEXT_ERROR_CODE.providerRequestFailed,
          message: 'OpenAI request failed.',
          provider: 'openai',
          modelId: this.config.modelId,
        },
      };
    }
  }
}

function getOpenAIOutputText(response: OpenAIResponsesResponse): string {
  const outputText = response.output_text?.trim();

  if (outputText) {
    return outputText;
  }

  return (
    response.output
      ?.flatMap((outputItem) => outputItem.content ?? [])
      .filter((contentItem) => contentItem.type === 'output_text')
      .map((contentItem) => contentItem.text ?? '')
      .join('')
      .trim() ?? ''
  );
}
