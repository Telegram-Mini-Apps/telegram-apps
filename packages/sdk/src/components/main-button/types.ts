import type { PostEvent } from '../../bridge/methods/postEvent.js';
import type { RGB } from '../../colors/types.js';
import type { StateEvents } from '../../state/types.js';

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
