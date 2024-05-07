import type { PostEvent } from '@/bridge/methods/postEvent.js';
import type { StateEvents } from '@/classes/State/types.js';
import type { RGB } from '@/colors/types.js';

export interface MainButtonParams {
  backgroundColor: RGB;
  isEnabled: boolean;
  isLoaderVisible: boolean;
  isVisible: boolean;
  text: string;
  textColor: RGB;
}

/**
 * MainButton constructor properties.
 */
export interface MainButtonProps extends MainButtonParams {
  postEvent: PostEvent;
}

/**
 * MainButton internal state.
 */
export interface MainButtonState extends MainButtonParams {
}

/**
 * MainButton trackable events.
 */
export interface MainButtonEvents extends StateEvents<MainButtonState> {
  /**
   * The MainButton was clicked.
   */
  click: () => void;
}

/**
 * MainButton event name.
 */
export type MainButtonEventName = keyof MainButtonEvents;

/**
 * MainButton event listener.
 */
export type MainButtonEventListener<E extends MainButtonEventName> = MainButtonEvents[E];
