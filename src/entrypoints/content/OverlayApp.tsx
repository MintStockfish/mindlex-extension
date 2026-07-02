import { Button, Group, Loader, Paper, Stack, Text } from '@mantine/core';
import type { OverlayState } from './types';

type OverlayAppProps = {
  state: OverlayState;
  onClose: () => void;
  onTranslate: () => void;
};

export function OverlayApp({ state, onClose, onTranslate }: OverlayAppProps) {
  if (state.kind === 'hidden') {
    return null;
  }

  if (state.kind === 'button') {
    return (
      <Button
        className="mindlex-translate-button"
        size="xs"
        variant="filled"
        onClick={onTranslate}
      >
        Translate
      </Button>
    );
  }

  return (
    <Paper className="mindlex-popup" shadow="xl" radius="md">
      <Group className="mindlex-popup-header" gap="xs" justify="space-between">
        <Text className="mindlex-title" fw={700} size="sm">
          Translation
        </Text>
        <button
          aria-label="Close"
          className="mindlex-close-button"
          type="button"
          onClick={onClose}
        >
          ×
        </button>
      </Group>

      <Stack className="mindlex-popup-body" gap="xs">
        {state.kind === 'loading' && (
          <Group className="mindlex-status" gap="sm">
            <Loader color="cyan" size="sm" />
            <Text c="dimmed" size="sm">
              Translating...
            </Text>
          </Group>
        )}

        {state.kind === 'success' && (
          <Text className="mindlex-result" size="sm">
            {state.translatedText}
          </Text>
        )}

        {state.kind === 'error' && (
          <Text className="mindlex-error" c="red.8" size="sm">
            {state.message}
          </Text>
        )}
      </Stack>
    </Paper>
  );
}
