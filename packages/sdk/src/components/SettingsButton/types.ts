import type { StateEvents } from '@/classes/State/types.js';

/**
 * SettingsButton internal state.
 */
export interface SettingsButtonState {
  isVisible: boolean;
}

/**
 * SettingsButton trackable events.
 */
export interface SettingsButtonEvents extends StateEvents<SettingsButtonState> {
  /**
   * The SettingsButton was clicked.
   */
  click: () => void;
}

/**
 * SettingsButton event name.
 */
export type SettingsButtonEventName = keyof SettingsButtonEvents;

/**
 * SettingsButton event listener.
 */
export type SettingsButtonEventListener<E extends SettingsButtonEventName> =
  SettingsButtonEvents[E];
