import type { MiniAppsEventListener } from '~/bridge/index.js';
import type { StateEvents } from '~/state/index.js';

export interface SettingsButtonState {
  isVisible: boolean;
}

export interface SettingsButtonEvents extends StateEvents<SettingsButtonState> {
  click: MiniAppsEventListener<'settings_button_pressed'>;
}

export type SettingsButtonEventName = keyof SettingsButtonEvents;

export type SettingsButtonEventListener<E extends SettingsButtonEventName> =
  SettingsButtonEvents[E];
