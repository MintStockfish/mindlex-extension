export type AnchorRect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

export type SelectionSnapshot = {
  text: string;
  rect: AnchorRect;
};

export type OverlayState =
  | { kind: 'hidden' }
  | { kind: 'button'; text: string; rect: AnchorRect }
  | { kind: 'loading'; text: string; rect: AnchorRect }
  | {
      kind: 'success';
      text: string;
      rect: AnchorRect;
      translatedText: string;
    }
  | { kind: 'error'; text: string; rect: AnchorRect; message: string };

export type VisibleOverlayState = Exclude<OverlayState, { kind: 'hidden' }>;

export type OverlayController = {
  container: HTMLElement;
  render: (state: OverlayState) => void;
};
