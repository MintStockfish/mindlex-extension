import { Button, Paper, Stack, Text, Title } from '@mantine/core';
import { LanguageSelectField } from '@/components/LanguageSelectField';
import { MindlexLogo } from '@/components/MindlexLogo';
import { useExtensionSettings } from '@/hooks/useExtensionSettings';
import { POPUP_COPY } from '@/shared/popup';
import { PROVIDER_LABELS } from '@/shared/settings';
import './App.css';

function App() {
  const { settings, isLoaded, setSourceLanguage, setTargetLanguage } =
    useExtensionSettings();

  return (
    <main className="popup-shell">
      <Paper className="popup-panel" p="lg">
        <Stack gap={20}>
          <div className="popup-brand">
            <MindlexLogo size="sm" flat />
            <div className="popup-brand-line" />
          </div>

          <Title order={3} className="popup-title">
            {POPUP_COPY.title}
          </Title>

          <div className="popup-meta-grid">
            <div className="popup-meta-card">
              <Text className="popup-meta-label">
                {POPUP_COPY.providerLabel}
              </Text>
              <Text className="popup-meta-value">
                {PROVIDER_LABELS[settings.provider]}
              </Text>
            </div>
            <div className="popup-meta-card">
              <Text className="popup-meta-label">{POPUP_COPY.modelLabel}</Text>
              <Text className="popup-meta-value">{settings.modelName}</Text>
            </div>
          </div>

          <Stack gap={14}>
            <LanguageSelectField
              label={POPUP_COPY.sourceLanguageLabel}
              value={settings.sourceLanguage}
              onChange={setSourceLanguage}
              disabled={!isLoaded}
              placeholder={POPUP_COPY.selectLanguagePlaceholder}
            />
            <LanguageSelectField
              label={POPUP_COPY.targetLanguageLabel}
              value={settings.targetLanguage}
              onChange={setTargetLanguage}
              disabled={!isLoaded}
              placeholder={POPUP_COPY.selectLanguagePlaceholder}
            />
          </Stack>

          <Button
            fullWidth
            color="cyan"
            className="popup-settings-button"
            disabled
          >
            {POPUP_COPY.settingsButtonLabel}
          </Button>
        </Stack>
      </Paper>
    </main>
  );
}

export default App;
