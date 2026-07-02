import { createOverlay } from './overlay';
import { readSelectionSnapshot } from './selection';
import { translateSelectedText } from './translationClient';
import type { OverlayState } from './types';

const SELECTION_UPDATE_DELAY_MS = 60;

export default defineContentScript({
  matches: ['http://*/*', 'https://*/*'],
  main() {
    const overlay = createOverlay({
      onClose: hideOverlay,
      onTranslate: translateCurrentSelection,
    });

    // Content script хранит состояние, React только отображает его
    let state: OverlayState = { kind: 'hidden' };
    let selectionUpdateTimer: number | undefined;
    let activeRequestId = 0;

    function setState(nextState: OverlayState) {
      state = nextState;
      overlay.render(state);
    }

    function hideOverlay() {
      // Скрытие overlay делает текущий запрос устаревшим
      activeRequestId += 1;
      setState({ kind: 'hidden' });
    }

    function scheduleSelectionUpdate() {
      // Дебаунс после выделения
      window.clearTimeout(selectionUpdateTimer);
      selectionUpdateTimer = window.setTimeout(
        updateFromSelection,
        SELECTION_UPDATE_DELAY_MS,
      );
    }

    function updateFromSelection() {
      const snapshot = readSelectionSnapshot();

      if (!snapshot) {
        if (state.kind === 'button') {
          hideOverlay();
        }

        return;
      }

      if (
        (state.kind === 'loading' ||
          state.kind === 'success' ||
          state.kind === 'error') &&
        state.text === snapshot.text
      ) {
        return;
      }

      activeRequestId += 1;
      setState({
        kind: 'button',
        text: snapshot.text,
        rect: snapshot.rect,
      });
    }

    async function translateCurrentSelection() {
      if (state.kind !== 'button') {
        return;
      }

      const requestId = activeRequestId + 1;
      activeRequestId = requestId;

      const { text, rect } = state;
      setState({ kind: 'loading', text, rect });

      try {
        const response = await translateSelectedText(text);

        // Если пользователь уже выбрал другой текст, то просто забиваем на результат перевода, чтобы не перетереть оверлей
        if (activeRequestId !== requestId) {
          return;
        }

        if (response.ok) {
          setState({
            kind: 'success',
            text,
            rect,
            translatedText: response.translatedText,
          });
          return;
        }

        setState({
          kind: 'error',
          text,
          rect,
          message: response.error.message,
        });
      } catch {
        // В случае, если ошибка связана со старым выделением, то также игнорим
        if (activeRequestId !== requestId) {
          return;
        }

        setState({
          kind: 'error',
          text,
          rect,
          message: 'Translation request failed.',
        });
      }
    }

    document.addEventListener('selectionchange', scheduleSelectionUpdate);
    document.addEventListener('mouseup', scheduleSelectionUpdate);
    document.addEventListener('keyup', scheduleSelectionUpdate);
    window.addEventListener('scroll', scheduleSelectionUpdate, {
      passive: true,
    });
    window.addEventListener('resize', scheduleSelectionUpdate);
    document.addEventListener(
      'pointerdown',
      (event) => {
        if (event.composedPath().includes(overlay.container)) {
          return;
        }

        if (state.kind !== 'hidden') {
          hideOverlay();
        }
      },
      true,
    );
  },
});
