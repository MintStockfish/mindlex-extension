import { useEffect, useState } from 'react';
import { isLanguageCode } from '../shared/languages';
import {
  DEFAULT_EXTENSION_SETTINGS,
  EXTENSION_SETTINGS_STORAGE_KEY,
  type ExtensionSettings,
} from '../shared/settings';

function isStoredSettings(value: unknown): value is Partial<ExtensionSettings> {
  return typeof value === 'object' && value !== null;
}

export function useExtensionSettings() {
  const [settings, setSettings] = useState<ExtensionSettings>(
    DEFAULT_EXTENSION_SETTINGS,
  );
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isActive = true;

    void browser.storage.local
      .get(EXTENSION_SETTINGS_STORAGE_KEY)
      .then((result) => {
        if (!isActive) {
          return;
        }

        const storedSettings = result[EXTENSION_SETTINGS_STORAGE_KEY];

        if (isStoredSettings(storedSettings)) {
          setSettings({
            ...DEFAULT_EXTENSION_SETTINGS,
            ...storedSettings,
          });
        }

        setIsHydrated(true);
      })
      .catch(() => {
        if (isActive) {
          setIsHydrated(true);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    void browser.storage.local.set({
      [EXTENSION_SETTINGS_STORAGE_KEY]: settings,
    });
  }, [isHydrated, settings]);

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
    isHydrated,
    setSourceLanguage: (value: string | null) => {
      updateLanguage('sourceLanguage', value);
    },
    setTargetLanguage: (value: string | null) => {
      updateLanguage('targetLanguage', value);
    },
  };
}
