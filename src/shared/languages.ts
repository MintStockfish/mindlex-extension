export const LANGUAGE_CODES = {
  english: 'en',
  german: 'de',
  spanish: 'es',
  french: 'fr',
  italian: 'it',
  polish: 'pl',
  japanese: 'ja',
  chinese: 'zh',
  belarusian: 'be',
  russian: 'ru',
} as const;

export type LanguageCode = (typeof LANGUAGE_CODES)[keyof typeof LANGUAGE_CODES];

export const LANGUAGE_OPTIONS = [
  { value: LANGUAGE_CODES.english, label: 'English' },
  { value: LANGUAGE_CODES.german, label: 'German' },
  { value: LANGUAGE_CODES.spanish, label: 'Spanish' },
  { value: LANGUAGE_CODES.french, label: 'French' },
  { value: LANGUAGE_CODES.italian, label: 'Italian' },
  { value: LANGUAGE_CODES.polish, label: 'Polish' },
  { value: LANGUAGE_CODES.japanese, label: 'Japanese' },
  { value: LANGUAGE_CODES.chinese, label: 'Chinese' },
  { value: LANGUAGE_CODES.belarusian, label: 'Belarusian' },
  { value: LANGUAGE_CODES.russian, label: 'Russian' },
] as const satisfies ReadonlyArray<{ value: LanguageCode; label: string }>;

const LANGUAGE_CODE_VALUES = new Set<LanguageCode>(
  Object.values(LANGUAGE_CODES),
);

export function isLanguageCode(value: string): value is LanguageCode {
  return LANGUAGE_CODE_VALUES.has(value as LanguageCode);
}
