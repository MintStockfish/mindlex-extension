import { PROVIDER_LABELS, type ProviderCode } from '@/shared/settings';
import { TRANSLATE_TEXT_ERROR_CODE } from '@/shared/translation';
import type { ProviderTranslateResult, TranslationProvider } from './types';

export class UnsupportedProvider implements TranslationProvider {
  constructor(private readonly provider: ProviderCode) {}

  translate(): ProviderTranslateResult {
    return {
      ok: false,
      error: {
        code: TRANSLATE_TEXT_ERROR_CODE.unsupportedProvider,
        message: `${PROVIDER_LABELS[this.provider]} translations are not implemented yet.`,
        provider: this.provider,
      },
    };
  }
}
