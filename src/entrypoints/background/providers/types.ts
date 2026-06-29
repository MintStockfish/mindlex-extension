import type { ProviderCode } from '@/shared/settings';
import type {
  TranslateTextRequest,
  TranslateTextResponse,
} from '@/shared/translation';

export type ProviderTranslateInput = TranslateTextRequest;
export type ProviderTranslateResult = TranslateTextResponse;

export type TranslationProvider = {
  translate(input: ProviderTranslateInput): Promise<ProviderTranslateResult>;
};

export type TranslationProviderConfig = {
  provider: ProviderCode;
  apiKey: string;
  modelId: string;
};
