import ky, { HTTPError } from 'ky';
import {
  createTranslationInput,
  createTranslationInstructions,
} from '../../translation/translationPrompt';
import { BaseTranslationProvider } from '../baseTranslationProvider';
import {
  createInvalidProviderResponseError,
  createProviderRequestFailedError,
} from '../providerErrors';
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
import type { ProviderTranslateInput } from '../types';

export class OpenAiProvider extends BaseTranslationProvider<
  OpenAIResponsesRequestBody,
  OpenAIResponsesResponse
> {
  protected readonly provider = 'openai';

  constructor(protected readonly config: OpenAIProviderConfig) {
    super();
  }

  protected createRequestBody(
    input: ProviderTranslateInput,
  ): OpenAIResponsesRequestBody {
    return {
      model: this.config.modelId,
      instructions: createTranslationInstructions(),
      input: createTranslationInput(input),
    };
  }

  protected async fetchProviderResponse(
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

  protected extractTranslatedText(response: OpenAIResponsesResponse): string {
    const outputText = response.output_text;

    if (outputText) {
      return outputText;
    }

    return (
      response.output
        ?.flatMap((outputItem) => outputItem.content ?? [])
        .filter((contentItem) => contentItem.type === 'output_text')
        .map((contentItem) => contentItem.text ?? '')
        .join('') ?? ''
    );
  }
}
