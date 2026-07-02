import { LANGUAGE_OPTIONS, type LanguageCode } from '@/shared/languages';
import type { ProviderTranslateInput } from '../providers/types';

export type ChatCompletionMessage = {
  role: 'system' | 'user';
  content: string;
};

const TRANSLATION_INSTRUCTIONS =
  'You are a translation engine. Return only the translated text without explanations.';

export function createTranslationMessages(
  input: ProviderTranslateInput,
): ChatCompletionMessage[] {
  return [
    {
      role: 'system',
      content: createTranslationInstructions(),
    },
    {
      role: 'user',
      content: createTranslationInput(input),
    },
  ];
}

export function createTranslationInstructions(): string {
  return TRANSLATION_INSTRUCTIONS;
}

export function createTranslationInput(input: ProviderTranslateInput): string {
  const sourceLanguage = getLanguageLabel(input.sourceLanguage);
  const targetLanguage = getLanguageLabel(input.targetLanguage);

  return `Translate from ${sourceLanguage} to ${targetLanguage}:\n\n${input.text}`;
}

function getLanguageLabel(languageCode: LanguageCode): string {
  return (
    LANGUAGE_OPTIONS.find((option) => option.value === languageCode)?.label ??
    languageCode
  );
}
