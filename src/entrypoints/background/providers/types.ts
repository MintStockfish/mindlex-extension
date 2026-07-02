import type { ProviderCode } from '@/shared/settings';
import type {
  TranslateTextFailure,
  TranslateTextRequest,
  TranslateTextResponse,
} from '@/shared/translation';

export type ProviderTranslateInput = TranslateTextRequest;
export type ProviderTranslateResult = TranslateTextResponse;

export type TranslationProvider = {
  translate(
    input: ProviderTranslateInput,
  ): ProviderTranslateResult | Promise<ProviderTranslateResult>;
};

export type TranslationProviderConfig = {
  provider: ProviderCode;
  apiKey: string;
  modelId: string;
};

export type TranslationProviderRuntimeConfig = {
  apiKey: string;
  modelId: string;
};

export type ProviderResponseResult<TProviderResponse> =
  | {
      ok: true;
      rawProviderResponse: unknown;
      parsedProviderResponse: TProviderResponse;
    }
  | TranslateTextFailure;
