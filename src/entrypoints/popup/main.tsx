import React from 'react';
import ReactDOM from 'react-dom/client';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { mindlexTheme } from '@/theme';
import App from '@/entrypoints/popup/App';
import './style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={mindlexTheme} forceColorScheme="dark">
      <App />
    </MantineProvider>
  </React.StrictMode>,
);
