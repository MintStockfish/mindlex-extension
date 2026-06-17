import {
  Button,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { MindlexLogo } from '../../components/MindlexLogo';
import { useExtensionSettings } from '../../hooks/useExtensionSettings';
import { LANGUAGE_OPTIONS } from '../../shared/languages';
import { POPUP_COPY } from '../../shared/popup';
import { PROVIDER_LABELS } from '../../shared/settings';
import './App.css';

function App() {
  const { settings, isHydrated, setSourceLanguage, setTargetLanguage } =
    useExtensionSettings();

  return (
    <main className="popup-shell">
      <Paper className="popup-panel" p="lg">
        <Stack gap={20}>
          <Group align="flex-start" wrap="nowrap">
            <div className="popup-brand">
              <MindlexLogo size="sm" flat />
              <div className="popup-brand-line" />
            </div>
          </Group>

          <div className="popup-hero">
            <Title order={3} className="popup-title">
              {POPUP_COPY.title}
            </Title>
          </div>

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

          <Stack gap={14} className="popup-controls">
            <div className="popup-field">
              <Text size="sm" fw={500} c="white" mb={6}>
                {POPUP_COPY.sourceLanguageLabel}
              </Text>
              <Select
                disabled={!isHydrated}
                searchable
                data={LANGUAGE_OPTIONS}
                value={settings.sourceLanguage}
                onChange={setSourceLanguage}
                placeholder={POPUP_COPY.selectLanguagePlaceholder}
                classNames={{
                  input: 'mindlex-select-input',
                  dropdown: 'mindlex-select-dropdown',
                  option: 'mindlex-select-option',
                }}
              />
            </div>

            <div className="popup-field">
              <Text size="sm" fw={500} c="white" mb={6}>
                {POPUP_COPY.targetLanguageLabel}
              </Text>
              <Select
                disabled={!isHydrated}
                searchable
                data={LANGUAGE_OPTIONS}
                value={settings.targetLanguage}
                onChange={setTargetLanguage}
                placeholder={POPUP_COPY.selectLanguagePlaceholder}
                classNames={{
                  input: 'mindlex-select-input',
                  dropdown: 'mindlex-select-dropdown',
                  option: 'mindlex-select-option',
                }}
              />
            </div>
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
