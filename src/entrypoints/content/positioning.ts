import type { AnchorRect } from './types';

const VIEWPORT_PADDING = 8;
const OVERLAY_GAP = 8;

export function positionContainer(
  container: HTMLElement,
  rect: AnchorRect,
  variant: 'button' | 'popup',
) {
  const estimatedWidth = variant === 'button' ? 92 : 320;
  const left = clamp(
    rect.left,
    VIEWPORT_PADDING,
    Math.max(VIEWPORT_PADDING, window.innerWidth - estimatedWidth),
  );
  const top = rect.bottom + OVERLAY_GAP;

  container.style.left = `${Math.round(left)}px`;
  container.style.top = `${Math.round(top)}px`;

  window.requestAnimationFrame(() => {
    clampContainerToViewport(container, rect);
  });
}

function clampContainerToViewport(
  container: HTMLElement,
  anchorRect: AnchorRect,
) {
  const bounds = container.getBoundingClientRect();
  let left = bounds.left;
  let top = bounds.top;

  if (bounds.right > window.innerWidth - VIEWPORT_PADDING) {
    left -= bounds.right - window.innerWidth + VIEWPORT_PADDING;
  }

  if (left < VIEWPORT_PADDING) {
    left = VIEWPORT_PADDING;
  }

  if (bounds.bottom > window.innerHeight - VIEWPORT_PADDING) {
    const aboveSelectionTop = anchorRect.top - bounds.height - OVERLAY_GAP;
    top =
      aboveSelectionTop >= VIEWPORT_PADDING
        ? aboveSelectionTop
        : window.innerHeight - bounds.height - VIEWPORT_PADDING;
  }

  if (top < VIEWPORT_PADDING) {
    top = VIEWPORT_PADDING;
  }

  container.style.left = `${Math.round(left)}px`;
  container.style.top = `${Math.round(top)}px`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
