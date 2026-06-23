import { useEffect, useState } from 'react';
import { isLanguageCode } from '@/shared/languages';
import {
  DEFAULT_EXTENSION_SETTINGS,
  normalizeSettings,
  type ExtensionSettings,
} from '@/shared/settings';
import { getSettings, saveSettings } from '@/shared/storage/extensionSettings';

export function useExtensionSettings() {
  const [settings, setSettings] = useState<ExtensionSettings>(
    DEFAULT_EXTENSION_SETTINGS,
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getSettings()
      .then((storedSettings) => {
        setSettings(normalizeSettings(storedSettings));
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
