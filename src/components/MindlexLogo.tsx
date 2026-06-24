import { Group, Text } from '@mantine/core';

const MINDLEX_LOGO_SRC = '/icon/logo.svg';

type MindlexLogoProps = {
  size?: 'sm' | 'md';
  flat?: boolean;
};

export function MindlexLogo({ size = 'md', flat = false }: MindlexLogoProps) {
  const iconSize = size === 'sm' ? 26 : 32;

  return (
    <Group gap={8} wrap="nowrap">
      <img
        src={MINDLEX_LOGO_SRC}
        aria-hidden="true"
        width={iconSize}
        height={iconSize}
        alt=""
      />

      <Text
        fw={500}
        size={size === 'sm' ? 'lg' : 'xl'}
        c={flat ? '#e6f7fb' : undefined}
        variant={flat ? undefined : 'gradient'}
        gradient={flat ? undefined : { from: 'cyan.5', to: 'blue.5', deg: 120 }}
        style={{ whiteSpace: 'nowrap', letterSpacing: 0 }}
      >
        Mindlex AI
      </Text>
    </Group>
  );
}
