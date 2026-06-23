import { useEffect, useState, type FormEvent } from 'react';
import {
  DEFAULT_EXTENSION_SETTINGS,
  isProviderCode,
  normalizeSettings,
  type ExtensionSettings,
  type ProviderCode,
} from '@/shared/settings';
import { getSettings, saveSettings } from '@/shared/storage/extensionSettings';

export type SaveStatus = 'idle' | 'saved' | 'error';

export function useOptionsSettingsForm() {
  const [savedSettings, setSavedSettings] = useState<ExtensionSettings>(
    DEFAULT_EXTENSION_SETTINGS,
  );
  const [settingsDraft, setSettingsDraft] = useState<ExtensionSettings>(
    DEFAULT_EXTENSION_SETTINGS,
  );
  const [activeProvider, setActiveProvider] = useState<ProviderCode>(
    DEFAULT_EXTENSION_SETTINGS.activeProvider,
  );
  const [apiKey, setApiKey] = useState('');
  const [modelId, setModelId] = useState(
    DEFAULT_EXTENSION_SETTINGS.providers[
      DEFAULT_EXTENSION_SETTINGS.activeProvider
    ].modelId,
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  useEffect(() => {
    let isActive = true;

    getSettings()
      .then((storedSettings) => {
        if (!isActive) {
          return;
        }

        const settings = normalizeSettings(storedSettings);
        const activeConfig = settings.providers[settings.activeProvider];

        setSavedSettings(settings);
        setSettingsDraft(settings);
        setActiveProvider(settings.activeProvider);
        setApiKey(activeConfig.apiKey);
        setModelId(activeConfig.modelId);
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        const activeConfig =
          DEFAULT_EXTENSION_SETTINGS.providers[
            DEFAULT_EXTENSION_SETTINGS.activeProvider
          ];

        setActiveProvider(DEFAULT_EXTENSION_SETTINGS.activeProvider);
        setApiKey(activeConfig.apiKey);
        setModelId(activeConfig.modelId);
      })
      .finally(() => {
        if (isActive) {
          setIsLoaded(true);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const applyCurrentProviderConfig = (
    settings: ExtensionSettings,
    nextActiveProvider = activeProvider,
  ): ExtensionSettings => ({
    ...settings,
    activeProvider: nextActiveProvider,
    providers: {
      ...settings.providers,
      [activeProvider]: {
        ...settings.providers[activeProvider],
        apiKey,
        modelId,
      },
    },
  });

  const setProvider = (value: string | null) => {
    if (!isProviderCode(value)) {
      return;
    }

    const nextDraft = applyCurrentProviderConfig(settingsDraft, value);
    const nextProviderConfig = nextDraft.providers[value];

    setSettingsDraft(nextDraft);
    setActiveProvider(value);
    setApiKey(nextProviderConfig.apiKey);
    setModelId(nextProviderConfig.modelId);
    setSaveStatus('idle');
  };

  const setApiKeyValue = (value: string) => {
    setApiKey(value);
    setSaveStatus('idle');
  };

  const setModelIdValue = (value: string | null) => {
    setModelId(value ?? '');
    setSaveStatus('idle');
  };

  const resetForm = () => {
    const activeConfig = savedSettings.providers[savedSettings.activeProvider];

    setSettingsDraft(savedSettings);
    setActiveProvider(savedSettings.activeProvider);
    setApiKey(activeConfig.apiKey);
    setModelId(activeConfig.modelId);
    setSaveStatus('idle');
  };

  const submitSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextSettings = applyCurrentProviderConfig(settingsDraft);

    setIsSaving(true);
    setSaveStatus('idle');

    try {
      await saveSettings(nextSettings);
      setSavedSettings(nextSettings);
      setSettingsDraft(nextSettings);
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    activeProvider,
    apiKey,
    modelId,
    isLoaded,
    isSaving,
    saveStatus,
    resetForm,
    setApiKeyValue,
    setModelIdValue,
    setProvider,
    submitSettings,
  };
}
