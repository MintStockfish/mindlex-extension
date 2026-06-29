import { LANGUAGE_OPTIONS, type LanguageCode } from '@/shared/languages';
import type { ProviderTranslateInput } from '../providers/types';

export type ChatCompletionMessage = {
  role: 'system' | 'user';
  content: string;
};

export function createTranslationMessages(
  input: ProviderTranslateInput,
): ChatCompletionMessage[] {
  const sourceLanguage = getLanguageLabel(input.sourceLanguage);
  const targetLanguage = getLanguageLabel(input.targetLanguage);

  return [
    {
      role: 'system',
      content:
        'You are a translation engine. Return only the translated text without explanations.',
    },
    {
      role: 'user',
      content: `Translate from ${sourceLanguage} to ${targetLanguage}:\n\n${input.text}`,
    },
  ];
}

function getLanguageLabel(languageCode: LanguageCode): string {
  return (
    LANGUAGE_OPTIONS.find((option) => option.value === languageCode)?.label ??
    languageCode
  );
}
