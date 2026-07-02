import type { AnchorRect, SelectionSnapshot } from './types';

export function readSelectionSnapshot(): SelectionSnapshot | null {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return null;
  }

  const text = selection.toString().trim();

  if (!text) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const rect = getRangeRect(range);

  if (!rect) {
    return null;
  }

  return { text, rect };
}

function getRangeRect(range: Range): AnchorRect | null {
  const rect = range.getBoundingClientRect();

  // Обычно достаточно общего rect для всего выделения.
  if (rect.width > 0 || rect.height > 0) {
    return toAnchorRect(rect);
  }

  // Нужно для того, чтобы расширение не падало с ошибкой при выделении нескольких строк одновременно.
  for (const clientRect of range.getClientRects()) {
    if (clientRect.width > 0 || clientRect.height > 0) {
      return toAnchorRect(clientRect);
    }
  }

  return null;
}

function toAnchorRect(rect: DOMRectReadOnly): AnchorRect {
  return {
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  };
}
