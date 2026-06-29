import { z } from 'zod';
import { PROVIDER_LABELS } from '@/shared/settings';
import {
  TRANSLATE_TEXT_ERROR_CODE,
  type TranslateTextFailure,
} from '@/shared/translation';
import type { TranslationProviderConfig } from './types';

const providerConfigSchema = z.object({
  provider: z.enum(['openrouter', 'openai', 'gemini']),
  apiKey: z.string().trim().min(1),
  modelId: z.string().trim().min(1),
});

export function validateProviderConfig(
  config: TranslationProviderConfig,
): TranslateTextFailure | null {
  const result = providerConfigSchema.safeParse(config);

  if (result.success) {
    return null;
  }

  const invalidField = result.error.issues[0]?.path[0];

  if (invalidField === 'apiKey') {
    return {
      ok: false,
      error: {
        code: TRANSLATE_TEXT_ERROR_CODE.missingApiKey,
        message: `${PROVIDER_LABELS[config.provider]} API key is not configured.`,
        provider: config.provider,
      },
    };
  }

  if (invalidField === 'modelId') {
    return {
      ok: false,
      error: {
        code: TRANSLATE_TEXT_ERROR_CODE.missingModelId,
        message: `${PROVIDER_LABELS[config.provider]} model ID is not configured.`,
        provider: config.provider,
      },
    };
  }

  return {
    ok: false,
    error: {
      code: TRANSLATE_TEXT_ERROR_CODE.invalidRequest,
      message: `${PROVIDER_LABELS[config.provider]} provider configuration is invalid.`,
      provider: config.provider,
    },
  };
}
