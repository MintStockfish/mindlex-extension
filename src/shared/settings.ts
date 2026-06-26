import { isLanguageCode, type LanguageCode } from '@/shared/languages';

export const EXTENSION_SETTINGS_STORAGE_KEY = 'mindlex.extension-settings';

export const PROVIDER_CODES = ['openrouter', 'openai', 'gemini'] as const;

export type ProviderCode = (typeof PROVIDER_CODES)[number];

export const PROVIDER_LABELS: Record<ProviderCode, string> = {
  openrouter: 'OpenRouter',
  openai: 'OpenAI',
  gemini: 'Gemini',
};

type OpenRouterConfig = {
  apiKey: string;
  modelId: string;
};

type OpenAIConfig = {
  apiKey: string;
  modelId: string;
};

type GeminiConfig = {
  apiKey: string;
  modelId: string;
};

type ProviderConfigs = {
  openrouter: OpenRouterConfig;
  openai: OpenAIConfig;
  gemini: GeminiConfig;
};

export type ExtensionSettings = {
  activeProvider: ProviderCode;
  providers: ProviderConfigs;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
};

const DEFAULT_PROVIDERS: ProviderConfigs = {
  openrouter: {
    apiKey: '',
    modelId: 'openai/gpt-4.1-mini',
  },
  openai: {
    apiKey: '',
    modelId: 'gpt-4.1-mini',
  },
  gemini: {
    apiKey: '',
    modelId: 'gemini-2.5-flash',
  },
};

export const DEFAULT_EXTENSION_SETTINGS: ExtensionSettings = {
  activeProvider: 'openrouter',
  providers: DEFAULT_PROVIDERS,
  sourceLanguage: 'en',
  targetLanguage: 'ru',
};

const PROVIDER_CODE_VALUES = new Set<ProviderCode>(PROVIDER_CODES);

export function isProviderCode(value: unknown): value is ProviderCode {
  return PROVIDER_CODE_VALUES.has(value as ProviderCode);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeProviderConfig<T extends { apiKey: string; modelId: string }>(
  value: unknown,
  fallback: T,
): T {
  if (!isRecord(value)) {
    return { ...fallback };
  }

  return {
    ...fallback,
    apiKey: typeof value.apiKey === 'string' ? value.apiKey : fallback.apiKey,
    modelId:
      typeof value.modelId === 'string' ? value.modelId : fallback.modelId,
  };
}

export function normalizeSettings(value: unknown): ExtensionSettings {
  if (!isRecord(value)) {
    return DEFAULT_EXTENSION_SETTINGS;
  }

  const activeProvider = isProviderCode(value.activeProvider)
    ? value.activeProvider
    : DEFAULT_EXTENSION_SETTINGS.activeProvider;

  const storedProviders = isRecord(value.providers) ? value.providers : {};
  const providers = {
    openrouter: normalizeProviderConfig(
      storedProviders.openrouter,
      DEFAULT_PROVIDERS.openrouter,
    ),
    openai: normalizeProviderConfig(
      storedProviders.openai,
      DEFAULT_PROVIDERS.openai,
    ),
    gemini: normalizeProviderConfig(
      storedProviders.gemini,
      DEFAULT_PROVIDERS.gemini,
    ),
  };

  return {
    activeProvider,
    providers,
    sourceLanguage:
      typeof value.sourceLanguage === 'string' &&
      isLanguageCode(value.sourceLanguage)
        ? value.sourceLanguage
        : DEFAULT_EXTENSION_SETTINGS.sourceLanguage,
    targetLanguage:
      typeof value.targetLanguage === 'string' &&
      isLanguageCode(value.targetLanguage)
        ? value.targetLanguage
        : DEFAULT_EXTENSION_SETTINGS.targetLanguage,
  };
}
