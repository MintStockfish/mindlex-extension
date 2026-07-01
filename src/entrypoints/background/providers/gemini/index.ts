import ky, { HTTPError } from 'ky';
import { TRANSLATE_TEXT_ERROR_CODE } from '@/shared/translation';
import {
  createTranslationInput,
  createTranslationInstructions,
} from '../../translation/translationPrompt';
import { validateProviderConfig } from '../validateProviderConfig';
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
import type {
  ProviderTranslateInput,
  ProviderTranslateResult,
  TranslationProvider,
} from '../types';

export class GeminiProvider implements TranslationProvider {
  constructor(private readonly config: GeminiProviderConfig) {}

  async translate(
    input: ProviderTranslateInput,
  ): Promise<ProviderTranslateResult> {
    const configError = validateProviderConfig({
      provider: 'gemini',
      ...this.config,
    });

    if (configError) {
      return configError;
    }

    const body = this.createRequestBody(input);
    const response = await this.fetchGenerateContent(body);

    if (!response.ok) {
      return response;
    }

    const translatedText = getGeminiOutputText(response.parsedProviderResponse);

    if (!translatedText) {
      return {
        ok: false,
        error: {
          code: TRANSLATE_TEXT_ERROR_CODE.emptyProviderResponse,
          message: 'Gemini response did not include translated text.',
          provider: 'gemini',
          modelId: this.config.modelId,
        },
      };
    }

    return {
      ok: true,
      translatedText,
      provider: 'gemini',
      modelId: this.config.modelId,
      rawProviderResponse: response.rawProviderResponse,
    };
  }

  private createRequestBody(
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

  private async fetchGenerateContent(
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
        return {
          ok: false,
          error: {
            code: TRANSLATE_TEXT_ERROR_CODE.invalidProviderResponse,
            message: 'Gemini response has unexpected format.',
            provider: 'gemini',
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
            message: `Gemini request failed with status ${error.response.status}.`,
            provider: 'gemini',
            modelId: this.config.modelId,
          },
        };
      }

      return {
        ok: false,
        error: {
          code: TRANSLATE_TEXT_ERROR_CODE.providerRequestFailed,
          message: 'Gemini request failed.',
          provider: 'gemini',
          modelId: this.config.modelId,
        },
      };
    }
  }
}

function createGeminiGenerateContentUrl(modelId: string): string {
  const modelPath = modelId.startsWith('models/')
    ? modelId
    : `models/${modelId}`;

  return `${GEMINI_API_BASE_URL}/${modelPath}:generateContent`;
}

function getGeminiOutputText(response: GeminiGenerateContentResponse): string {
  return response.candidates
    .flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text ?? '')
    .join('')
    .trim();
}
