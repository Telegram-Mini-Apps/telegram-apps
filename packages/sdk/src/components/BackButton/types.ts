import type { MiniAppsEventListener } from '@/bridge/events/types.js';
import type { StateEvents } from '@/classes/with-state/types.js';

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
}

/**
 * BackButton event name.
 */
export type BackButtonEventName = keyof BackButtonEvents;

/**
 * BackButton event listener.
 */
export type BackButtonEventListener<E extends BackButtonEventName> = BackButtonEvents[E];

/**
 * BackButton click event listener.
 */
export type BackButtonClickListener = MiniAppsEventListener<'back_button_pressed'>;
