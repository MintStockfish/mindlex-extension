import { createTheme } from '@mantine/core';

export const mindlexTheme = createTheme({
  primaryColor: 'cyan',
  defaultRadius: 'md',
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  headings: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontWeight: '500',
  },
  colors: {
    mindlex: [
      '#effcff',
      '#d8f7ff',
      '#aeeeff',
      '#73e1ff',
      '#30d3ff',
      '#06b6d4',
      '#0891b2',
      '#0e7490',
      '#155e75',
      '#164e63',
    ],
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Select: {
      defaultProps: {
        radius: 'md',
      },
    },
    Combobox: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
});
