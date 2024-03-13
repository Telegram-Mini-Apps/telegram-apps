import type { MiniAppsEventListener } from '../../bridge/events/events.js';
import type { StateEvents } from '../../state/types.js';

export interface SettingsButtonState {
  isVisible: boolean;
}

export interface SettingsButtonEvents extends StateEvents<SettingsButtonState> {
  click: MiniAppsEventListener<'settings_button_pressed'>;
}

export type SettingsButtonEventName = keyof SettingsButtonEvents;

export type SettingsButtonEventListener<E extends SettingsButtonEventName> =
  SettingsButtonEvents[E];
