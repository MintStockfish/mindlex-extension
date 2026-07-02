import type { LanguageCode } from '@/shared/languages';
import type { ProviderCode } from '@/shared/settings';

export const TRANSLATE_TEXT_MESSAGE = 'mindlex.translate-text';

export type TranslateTextRequest = {
  text: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
};

export type TranslateTextMessagePayload = {
  text: string;
};

export type TranslateTextMessage = {
  type: typeof TRANSLATE_TEXT_MESSAGE;
  payload: TranslateTextMessagePayload;
};

export const TRANSLATE_TEXT_ERROR_CODE = {
  invalidRequest: 'invalid_request',
  missingApiKey: 'missing_api_key',
  missingModelId: 'missing_model_id',
  unsupportedProvider: 'unsupported_provider',
  providerRequestFailed: 'provider_request_failed',
  emptyProviderResponse: 'empty_provider_response',
  invalidProviderResponse: 'invalid_provider_response',
  notImplemented: 'not_implemented',
  internalError: 'internal_error',
} as const;

export type TranslateTextErrorCode =
  (typeof TRANSLATE_TEXT_ERROR_CODE)[keyof typeof TRANSLATE_TEXT_ERROR_CODE];

export type TranslateTextSuccess = {
  ok: true;
  translatedText: string;
  provider: ProviderCode;
  modelId: string;
  rawProviderResponse?: unknown;
};

export type TranslateTextFailure = {
  ok: false;
  error: {
    code: TranslateTextErrorCode;
    message: string;
    provider?: ProviderCode;
    modelId?: string;
  };
};

export type TranslateTextResponse = TranslateTextSuccess | TranslateTextFailure;
