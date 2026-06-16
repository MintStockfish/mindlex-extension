import {
  Button,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import { MindlexLogo } from '../../components/MindlexLogo';
import './App.css';

const languages = [
  { value: 'English', label: 'English' },
  { value: 'German', label: 'German' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'Italian', label: 'Italian' },
  { value: 'Polish', label: 'Polish' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'Belarusian', label: 'Belarusian' },
  { value: 'Russian', label: 'Russian' },
];

function App() {
  const [sourceLanguage, setSourceLanguage] = useState<string | null>(
    'English',
  );
  const [targetLanguage, setTargetLanguage] = useState<string | null>(
    'Russian',
  );
  const modelName = 'gpt-4.1-mini';

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
              Перевод и захват лексики
            </Title>
          </div>

          <div className="popup-meta-grid">
            <div className="popup-meta-card">
              <Text className="popup-meta-label">Provider</Text>
              <Text className="popup-meta-value">OpenAI</Text>
            </div>
            <div className="popup-meta-card">
              <Text className="popup-meta-label">Model</Text>
              <Text className="popup-meta-value">{modelName}</Text>
            </div>
          </div>

          <Stack gap={14} className="popup-controls">
            <div className="popup-field">
              <Text size="sm" fw={500} c="white" mb={6}>
                Исходный язык
              </Text>
              <Select
                searchable
                data={languages}
                value={sourceLanguage}
                onChange={setSourceLanguage}
                placeholder="Select language..."
                classNames={{
                  input: 'mindlex-select-input',
                  dropdown: 'mindlex-select-dropdown',
                  option: 'mindlex-select-option',
                }}
              />
            </div>

            <div className="popup-field">
              <Text size="sm" fw={500} c="white" mb={6}>
                Язык перевода
              </Text>
              <Select
                searchable
                data={languages}
                value={targetLanguage}
                onChange={setTargetLanguage}
                placeholder="Select language..."
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
            Open settings
          </Button>
        </Stack>
      </Paper>
    </main>
  );
}

export default App;
