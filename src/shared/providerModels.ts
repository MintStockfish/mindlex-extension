import type { ProviderCode } from '@/shared/settings';

export type ProviderModelOption = {
  label: string;
  value: string;
};

export const MODEL_OPTIONS_BY_PROVIDER: Record<
  ProviderCode,
  ProviderModelOption[]
> = {
  openrouter: [
    { value: 'openai/gpt-4.1-mini', label: 'GPT-4.1 Mini' },
    { value: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { value: 'anthropic/claude-3.5-haiku', label: 'Claude 3.5 Haiku' },
  ],
  openai: [{ value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' }],
  gemini: [{ value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' }],
};
