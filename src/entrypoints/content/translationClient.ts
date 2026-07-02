import {
  TRANSLATE_TEXT_MESSAGE,
  type TranslateTextMessage,
  type TranslateTextResponse,
} from '@/shared/translation';

export async function translateSelectedText(text: string) {
  const message: TranslateTextMessage = {
    type: TRANSLATE_TEXT_MESSAGE,
    payload: { text },
  };

  return browser.runtime.sendMessage(message) as Promise<TranslateTextResponse>;
}
