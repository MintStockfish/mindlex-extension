import { useEffect, useState } from 'react';
import { isLanguageCode } from '@/shared/languages';
import {
  DEFAULT_EXTENSION_SETTINGS,
  type ExtensionSettings,
} from '@/shared/settings';
import { getSettings, saveSettings } from '@/shared/storage/extensionSettings';

const EXTENSION_SETTINGS_KEYS = [
  'provider',
  'modelName',
  'sourceLanguage',
  'targetLanguage',
] as const satisfies ReadonlyArray<keyof ExtensionSettings>;

function isExtensionSettingsLike(
  value: unknown,
): value is Partial<ExtensionSettings> {
  return (
    typeof value === 'object' &&
    value !== null &&
    EXTENSION_SETTINGS_KEYS.some((key) => key in value)
  );
}

export function useExtensionSettings() {
  const [settings, setSettings] = useState<ExtensionSettings>(
    DEFAULT_EXTENSION_SETTINGS,
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getSettings()
      .then((storedSettings) => {
        if (isExtensionSettingsLike(storedSettings)) {
          setSettings({
            ...DEFAULT_EXTENSION_SETTINGS,
            ...storedSettings,
          });
        }

        setIsLoaded(true);
      })
      .catch(() => {
        setIsLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    void saveSettings(settings);
  }, [isLoaded, settings]);

  const updateLanguage = (
    key: 'sourceLanguage' | 'targetLanguage',
    value: string | null,
  ) => {
    if (!value || !isLanguageCode(value)) {
      return;
    }

    setSettings((currentSettings) => ({
      ...currentSettings,
      [key]: value,
    }));
  };

  return {
    settings,
    isLoaded,
    setSourceLanguage: (value: string | null) => {
      updateLanguage('sourceLanguage', value);
    },
    setTargetLanguage: (value: string | null) => {
      updateLanguage('targetLanguage', value);
    },
  };
}
