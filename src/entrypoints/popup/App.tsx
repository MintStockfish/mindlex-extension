import { Button, Paper, Stack, Text, Title } from '@mantine/core';
import { LanguageSelectField } from '@/components/LanguageSelectField';
import { MindlexLogo } from '@/components/MindlexLogo';
import { useExtensionSettings } from '@/hooks/useExtensionSettings';
import { POPUP_TEXT } from '@/shared/popup';
import { PROVIDER_LABELS } from '@/shared/settings';
import './App.css';

function App() {
  const { settings, isLoaded, setSourceLanguage, setTargetLanguage } =
    useExtensionSettings();

  const openSettings = () => {
    void browser.runtime.openOptionsPage();
  };

  const activeProviderConfig = settings.providers[settings.activeProvider];

  return (
    <main className="popup-shell">
      <Paper className="popup-panel" p="lg">
        <Stack gap={20}>
          <div className="popup-brand">
            <MindlexLogo size="sm" flat />
            <div className="popup-brand-line" />
          </div>

          <Title order={3} className="popup-title">
            {POPUP_TEXT.title}
          </Title>

          <div className="popup-meta-grid">
            <div className="popup-meta-card">
              <Text className="popup-meta-label">
                {POPUP_TEXT.providerLabel}
              </Text>
              <Text className="popup-meta-value">
                {PROVIDER_LABELS[settings.activeProvider]}
              </Text>
            </div>
            <div className="popup-meta-card">
              <Text className="popup-meta-label">{POPUP_TEXT.modelLabel}</Text>
              <Text className="popup-meta-value">
                {activeProviderConfig.modelId}
              </Text>
            </div>
          </div>

          <Stack gap={14}>
            <LanguageSelectField
              label={POPUP_TEXT.sourceLanguageLabel}
              value={settings.sourceLanguage}
              onChange={setSourceLanguage}
              disabled={!isLoaded}
              loading={!isLoaded}
              placeholder={POPUP_TEXT.selectLanguagePlaceholder}
            />
            <LanguageSelectField
              label={POPUP_TEXT.targetLanguageLabel}
              value={settings.targetLanguage}
              onChange={setTargetLanguage}
              disabled={!isLoaded}
              loading={!isLoaded}
              placeholder={POPUP_TEXT.selectLanguagePlaceholder}
            />
          </Stack>

          <Button
            fullWidth
            color="cyan"
            className="popup-settings-button"
            onClick={openSettings}
          >
            {POPUP_TEXT.settingsButtonLabel}
          </Button>
        </Stack>
      </Paper>
    </main>
  );
}

export default App;
