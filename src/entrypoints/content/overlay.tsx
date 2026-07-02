import React from 'react';
import ReactDOM from 'react-dom/client';
import '@mantine/core/styles/Button.css';
import '@mantine/core/styles/Group.css';
import '@mantine/core/styles/Loader.css';
import '@mantine/core/styles/Paper.css';
import '@mantine/core/styles/Stack.css';
import '@mantine/core/styles/Text.css';
import { MantineProvider } from '@mantine/core';
import { mindlexTheme } from '@/theme';
import { OverlayApp } from './OverlayApp';
import { positionContainer } from './positioning';
import type {
  OverlayController,
  OverlayState,
  VisibleOverlayState,
} from './types';
import './overlay.css';

const ROOT_ID = 'mindlex-selection-translation-root';

export function createOverlay({
  onClose,
  onTranslate,
}: {
  onClose: () => void;
  onTranslate: () => void;
}): OverlayController {
  // На всякий удаляем предыдущий контейнер
  document.getElementById(ROOT_ID)?.remove();

  const container = document.createElement('div');
  container.id = ROOT_ID;

  // Клики внутри overlay не должны сбрасывать выделение на странице.
  container.addEventListener('mousedown', (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
  container.addEventListener('pointerdown', (event) => {
    event.stopPropagation();
  });

  (document.body ?? document.documentElement).append(container);

  const root = ReactDOM.createRoot(container);

  function render(state: OverlayState) {
    container.hidden = state.kind === 'hidden';
    root.render(
      <React.StrictMode>
        <MantineProvider
          theme={mindlexTheme}
          forceColorScheme="light"
          cssVariablesSelector={`#${ROOT_ID}`}
          getRootElement={() => container}
        >
          <OverlayApp
            state={state}
            onClose={onClose}
            onTranslate={onTranslate}
          />
        </MantineProvider>
      </React.StrictMode>,
    );

    if (state.kind !== 'hidden') {
      // Определяем позицию оверлея относительно выделенного текста
      positionContainer(container, state.rect, getOverlayVariant(state));
    }
  }

  return { container, render };
}

function getOverlayVariant(state: VisibleOverlayState) {
  return state.kind === 'button' ? 'button' : 'popup';
}
