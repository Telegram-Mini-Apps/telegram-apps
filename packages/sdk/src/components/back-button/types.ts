import type { MiniAppsEventListener } from '../../bridge/events/events.js';
import type { StateEvents } from '../../state/types.js';

export interface BackButtonState {
  isVisible: boolean;
}

export interface BackButtonEvents extends StateEvents<BackButtonState> {
  click: MiniAppsEventListener<'main_button_pressed'>;
}

export type BackButtonEventName = keyof BackButtonEvents;

export type BackButtonEventListener<E extends BackButtonEventName> = BackButtonEvents[E];
