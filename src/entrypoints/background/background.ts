import { getSettings } from '@/shared/storage/extensionSettings';
import {
  isTranslateTextMessage,
  TRANSLATE_TEXT_ERROR_CODE,
  type TranslateTextRequest,
  type TranslateTextResponse,
} from '@/shared/translation';
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
  request: TranslateTextRequest,
): Promise<TranslateTextResponse> {
  try {
    const settings = await getSettings();

    return translateText(request, settings);
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
