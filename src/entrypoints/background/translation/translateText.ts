import type { ExtensionSettings } from '@/shared/settings';
import {
  TRANSLATE_TEXT_ERROR_CODE,
  type TranslateTextRequest,
  type TranslateTextResponse,
} from '@/shared/translation';
import { createTranslationProvider } from '../providers/createTranslationProvider';

export async function translateText(
  request: TranslateTextRequest,
  settings: ExtensionSettings,
): Promise<TranslateTextResponse> {
  const text = request.text.trim();

  if (!text) {
    return {
      ok: false,
      error: {
        code: TRANSLATE_TEXT_ERROR_CODE.invalidRequest,
        message: 'Text to translate is empty.',
      },
    };
  }

  const provider = createTranslationProvider(settings);

  return provider.translate({
    ...request,
    text,
  });
}
