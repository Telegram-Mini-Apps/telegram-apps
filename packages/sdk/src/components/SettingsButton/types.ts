import type { MiniAppsEventListener } from '@/bridge/events/types.js';
import type { StateEvents } from '@/classes/with-state/types.js';

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

/**
 * SettingsButton click event listener.
 */
export type SettingsButtonClickListener = MiniAppsEventListener<'settings_button_pressed'>;
