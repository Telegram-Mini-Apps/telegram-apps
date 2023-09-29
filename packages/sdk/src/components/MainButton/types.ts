import type { RGB } from '@tma.js/colors';

import type { StateEvents } from '../../state/index.js';

export interface MainButtonState {
  backgroundColor: RGB;
  isEnabled: boolean;
  isVisible: boolean;
  isProgressVisible: boolean;
  text: string;
  textColor: RGB;
}

export interface MainButtonEvents extends StateEvents<MainButtonState> {
  click: () => void;
}

export type MainButtonEventName = keyof MainButtonEvents;

export type MainButtonEventListener<E extends MainButtonEventName> = MainButtonEvents[E];
