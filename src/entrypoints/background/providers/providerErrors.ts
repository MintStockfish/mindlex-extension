import { PROVIDER_LABELS, type ProviderCode } from '@/shared/settings';
import {
  TRANSLATE_TEXT_ERROR_CODE,
  type TranslateTextFailure,
} from '@/shared/translation';

type ProviderErrorInput = {
  provider: ProviderCode;
  modelId: string;
};

export function createEmptyProviderResponseError({
  provider,
  modelId,
}: ProviderErrorInput): TranslateTextFailure {
  return {
    ok: false,
    error: {
      code: TRANSLATE_TEXT_ERROR_CODE.emptyProviderResponse,
      message: `${PROVIDER_LABELS[provider]} response did not include translated text.`,
      provider,
      modelId,
    },
  };
}

export function createInvalidProviderResponseError({
  provider,
  modelId,
}: ProviderErrorInput): TranslateTextFailure {
  return {
    ok: false,
    error: {
      code: TRANSLATE_TEXT_ERROR_CODE.invalidProviderResponse,
      message: `${PROVIDER_LABELS[provider]} response has unexpected format.`,
      provider,
      modelId,
    },
  };
}

export function createProviderRequestFailedError({
  provider,
  modelId,
  status,
}: ProviderErrorInput & { status?: number }): TranslateTextFailure {
  const providerLabel = PROVIDER_LABELS[provider];

  return {
    ok: false,
    error: {
      code: TRANSLATE_TEXT_ERROR_CODE.providerRequestFailed,
      message:
        status === undefined
          ? `${providerLabel} request failed.`
          : `${providerLabel} request failed with status ${status}.`,
      provider,
      modelId,
    },
  };
}
