import type { RGB } from '@twa.js/utils';

export interface MainButtonEvents {
  backgroundColorChanged: (color: RGB) => void;
  click: () => void;
  isEnabledChanged: (isEnabled: boolean) => void;
  isProgressVisibleChanged: (isVisible: boolean) => void;
  isVisibleChanged: (isVisible: boolean) => void;
  textChanged: (text: string) => void;
  textColorChanged: (color: RGB) => void;
}

export type MainButtonEventName = keyof MainButtonEvents;

export type MainButtonEventListener<E extends MainButtonEventName> = MainButtonEvents[E];
