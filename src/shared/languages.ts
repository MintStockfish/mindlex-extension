export type LanguageCode =
  | 'en'
  | 'de'
  | 'es'
  | 'fr'
  | 'it'
  | 'pl'
  | 'ja'
  | 'zh'
  | 'be'
  | 'ru';

export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'German' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'it', label: 'Italian' },
  { value: 'pl', label: 'Polish' },
  { value: 'ja', label: 'Japanese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'be', label: 'Belarusian' },
  { value: 'ru', label: 'Russian' },
] as const satisfies ReadonlyArray<{ value: LanguageCode; label: string }>;

const LANGUAGE_CODES = new Set<LanguageCode>(
  LANGUAGE_OPTIONS.map(({ value }) => value),
);

export function isLanguageCode(value: string): value is LanguageCode {
  return LANGUAGE_CODES.has(value as LanguageCode);
}
