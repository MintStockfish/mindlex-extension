import type { LanguageCode } from './languages';

export const EXTENSION_SETTINGS_STORAGE_KEY = 'mindlex.extension-settings';

export type ProviderCode = 'openai' | 'gemini';

export type ExtensionSettings = {
  provider: ProviderCode;
  modelName: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
};

export const PROVIDER_LABELS: Record<ProviderCode, string> = {
  openai: 'OpenAI',
  gemini: 'Gemini',
};

export const DEFAULT_EXTENSION_SETTINGS: ExtensionSettings = {
  provider: 'openai',
  modelName: 'gpt-4.1-mini',
  sourceLanguage: 'en',
  targetLanguage: 'ru',
};
