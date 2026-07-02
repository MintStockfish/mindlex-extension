import type { ExtensionSettings } from '@/shared/settings';
import { GeminiProvider } from './gemini';
import { OpenAiProvider } from './openai';
import { OpenRouterProvider } from './openrouter';
import type { TranslationProvider } from './types';

type TranslationProviderSettings = Pick<
  ExtensionSettings,
  'activeProvider' | 'providers'
>;

export function createTranslationProvider(
  settings: TranslationProviderSettings,
): TranslationProvider {
  switch (settings.activeProvider) {
    case 'openrouter':
      return new OpenRouterProvider(settings.providers.openrouter);

    case 'openai':
      return new OpenAiProvider(settings.providers.openai);

    case 'gemini':
      return new GeminiProvider(settings.providers.gemini);
  }
}
