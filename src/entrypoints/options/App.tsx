import {
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Radio,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { PasswordVisibilityIcon } from '@/components/PasswordVisibilityIcon';
import { MODEL_OPTIONS_BY_PROVIDER } from '@/shared/providerModels';
import { PROVIDER_CODES, PROVIDER_LABELS } from '@/shared/settings';
import { useOptionsSettingsForm } from '@/entrypoints/options/useOptionsSettingsForm';
import './App.css';

const providerOptions = PROVIDER_CODES.map((value) => ({
  label: PROVIDER_LABELS[value],
  value,
}));

function App() {
  const {
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
  } = useOptionsSettingsForm();

  return (
    <main className="options-shell">
      <Container size="sm" py="xl">
        <Paper className="options-panel" p="lg" radius="sm" withBorder>
          <form onSubmit={submitSettings}>
            <Stack gap="lg">
              <Radio.Group
                name="activeProvider"
                value={activeProvider}
                onChange={setProvider}
              >
                <div className="provider-grid">
                  {providerOptions.map((provider) => (
                    <Radio.Card
                      key={provider.value}
                      value={provider.value}
                      className="provider-card"
                      radius="sm"
                    >
                      <Group gap="sm" wrap="nowrap">
                        <Radio.Indicator />
                        <span className="provider-card-label">
                          {provider.label}
                        </span>
                      </Group>
                    </Radio.Card>
                  ))}
                </div>
              </Radio.Group>

              <Stack gap="md">
                <PasswordInput
                  name="apiKey"
                  label="API key"
                  placeholder="Enter provider API key"
                  visibilityToggleIcon={({ reveal }) => (
                    <PasswordVisibilityIcon reveal={reveal} />
                  )}
                  value={apiKey}
                  disabled={!isLoaded}
                  onChange={(event) => {
                    setApiKeyValue(event.target.value);
                  }}
                />

                <Select
                  searchable
                  name="modelId"
                  label="Model ID"
                  placeholder="Select model"
                  data={MODEL_OPTIONS_BY_PROVIDER[activeProvider]}
                  value={modelId}
                  disabled={!isLoaded}
                  onChange={setModelIdValue}
                />
              </Stack>

              <Text
                className="save-status"
                size="sm"
                c={saveStatus === 'error' ? 'red.3' : 'cyan.2'}
              >
                {saveStatus === 'saved'
                  ? 'Settings saved'
                  : saveStatus === 'error'
                    ? 'Failed to save settings'
                    : '\u00A0'}
              </Text>

              <Group justify="flex-end" gap="sm">
                <Button
                  type="button"
                  variant="default"
                  disabled={!isLoaded || isSaving}
                  onClick={resetForm}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  color="cyan"
                  disabled={!isLoaded}
                  loading={isSaving}
                >
                  Save settings
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Container>
    </main>
  );
}

export default App;
