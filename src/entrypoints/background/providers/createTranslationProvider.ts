import type { ExtensionSettings } from '@/shared/settings';
import { OpenRouterProvider } from './openrouter';
import { UnsupportedProvider } from './unsupportedProvider';
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
      return new UnsupportedProvider('openai');

    case 'gemini':
      return new UnsupportedProvider('gemini');
  }
}
