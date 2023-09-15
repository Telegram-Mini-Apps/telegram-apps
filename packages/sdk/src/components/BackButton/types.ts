import type { StateEvents } from '../../state/index.js';

export interface BackButtonState {
  isVisible: boolean;
}

export interface BackButtonEvents extends StateEvents<BackButtonState> {
  click: () => void;
}

export type BackButtonEventName = keyof BackButtonEvents;

export type BackButtonEventListener<E extends BackButtonEventName> = BackButtonEvents[E];
