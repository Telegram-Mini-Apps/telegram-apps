import type { PostEvent } from '~/bridge/index.js';
import type { RGB } from '~/colors/index.js';
import type { StateEvents } from '~/state/index.js';

export interface MainButtonParams {
  backgroundColor?: RGB;
  isEnabled?: boolean;
  isLoaderVisible?: boolean;
  isVisible?: boolean;
  text?: string;
  textColor?: RGB;
}

export interface MainButtonProps extends Required<MainButtonParams> {
  postEvent?: PostEvent;
}

export type MainButtonState = Required<MainButtonParams>;

export interface MainButtonEvents extends StateEvents<MainButtonState> {
  click: () => void;
}

export type MainButtonEventName = keyof MainButtonEvents;

export type MainButtonEventListener<E extends MainButtonEventName> = MainButtonEvents[E];
