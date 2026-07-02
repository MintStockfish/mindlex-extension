import { getSettings } from '@/shared/storage/extensionSettings';
import {
  TRANSLATE_TEXT_ERROR_CODE,
  type TranslateTextMessagePayload,
  type TranslateTextResponse,
} from '@/shared/translation';
import { isTranslateTextMessage } from '@/shared/translationMessageSchema';
import { translateText } from './translation/translateText';

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    void sender;

    if (!isTranslateTextMessage(message)) {
      return;
    }

    void handleTranslateTextMessage(message.payload).then(sendResponse);

    return true;
  });
});

async function handleTranslateTextMessage(
  request: TranslateTextMessagePayload,
): Promise<TranslateTextResponse> {
  try {
    const settings = await getSettings();

    return translateText(
      {
        text: request.text,
        sourceLanguage: settings.sourceLanguage,
        targetLanguage: settings.targetLanguage,
      },
      settings,
    );
  } catch {
    return {
      ok: false,
      error: {
        code: TRANSLATE_TEXT_ERROR_CODE.internalError,
        message: 'Unexpected translation error.',
      },
    };
  }
}
