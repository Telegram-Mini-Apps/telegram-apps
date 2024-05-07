import type { StateEvents } from '@/classes/State/types.js';

/**
 * BackButton internal state.
 */
export interface BackButtonState {
  isVisible: boolean;
}

/**
 * BackButton trackable events.
 */
export interface BackButtonEvents extends StateEvents<BackButtonState> {
  /**
   * The BackButton was clicked.
   */
  click: () => void;
}

/**
 * BackButton event name.
 */
export type BackButtonEventName = keyof BackButtonEvents;

/**
 * BackButton event listener.
 */
export type BackButtonEventListener<E extends BackButtonEventName> = BackButtonEvents[E];
