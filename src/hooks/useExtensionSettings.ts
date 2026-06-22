import { useEffect, useState } from 'react';
import { isLanguageCode } from '@/shared/languages';
import {
  DEFAULT_EXTENSION_SETTINGS,
  type ExtensionSettings,
} from '@/shared/settings';
import { getSettings, saveSettings } from '@/shared/storage/extensionSettings';

function isStoredSettings(value: unknown): value is Partial<ExtensionSettings> {
  return typeof value === 'object' && value !== null;
}

export function useExtensionSettings() {
  const [settings, setSettings] = useState<ExtensionSettings>(
    DEFAULT_EXTENSION_SETTINGS,
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isActive = true;

    getSettings()
      .then((storedSettings) => {
        if (!isActive) {
          return;
        }

        if (isStoredSettings(storedSettings)) {
          setSettings({
            ...DEFAULT_EXTENSION_SETTINGS,
            ...storedSettings,
          });
        }

        setIsLoaded(true);
      })
      .catch(() => {
        if (isActive) {
          setIsLoaded(true);
        }
      });

    return () => {
      isActive = false;
    };
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
