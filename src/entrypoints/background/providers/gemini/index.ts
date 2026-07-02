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
  GEMINI_API_BASE_URL,
  GEMINI_REQUEST_TIMEOUT_MS,
  GEMINI_RETRY_LIMIT,
  GEMINI_RETRY_METHODS,
  GEMINI_RETRY_STATUS_CODES,
} from './gemini.constants';
import { geminiGenerateContentResponseSchema } from './gemini.schemas';
import type {
  GeminiGenerateContentRequestBody,
  GeminiGenerateContentResponse,
  GeminiGenerateContentResult,
  GeminiProviderConfig,
} from './gemini.types';
import type { ProviderTranslateInput } from '../types';

export class GeminiProvider extends BaseTranslationProvider<
  GeminiGenerateContentRequestBody,
  GeminiGenerateContentResponse
> {
  protected readonly provider = 'gemini';

  constructor(protected readonly config: GeminiProviderConfig) {
    super();
  }

  protected createRequestBody(
    input: ProviderTranslateInput,
  ): GeminiGenerateContentRequestBody {
    return {
      systemInstruction: {
        parts: [
          {
            text: createTranslationInstructions(),
          },
        ],
      },
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: createTranslationInput(input),
            },
          ],
        },
      ],
    };
  }

  protected async fetchProviderResponse(
    body: GeminiGenerateContentRequestBody,
  ): Promise<GeminiGenerateContentResult> {
    try {
      const rawProviderResponse = await ky
        .post(createGeminiGenerateContentUrl(this.config.modelId), {
          headers: {
            'x-goog-api-key': this.config.apiKey,
          },
          json: body,
          retry: {
            limit: GEMINI_RETRY_LIMIT,
            methods: [...GEMINI_RETRY_METHODS],
            statusCodes: [...GEMINI_RETRY_STATUS_CODES],
          },
          timeout: GEMINI_REQUEST_TIMEOUT_MS,
        })
        .json<unknown>();
      const parsedProviderResponse =
        geminiGenerateContentResponseSchema.safeParse(rawProviderResponse);

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
    response: GeminiGenerateContentResponse,
  ): string {
    return response.candidates
      .flatMap((candidate) => candidate.content?.parts ?? [])
      .map((part) => part.text ?? '')
      .join('');
  }
}

function createGeminiGenerateContentUrl(modelId: string): string {
  const modelPath = modelId.startsWith('models/')
    ? modelId
    : `models/${modelId}`;

  return `${GEMINI_API_BASE_URL}/${modelPath}:generateContent`;
}
