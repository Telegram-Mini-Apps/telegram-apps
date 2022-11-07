import {EventNames, EventListener} from 'twa-core';

export interface ThemeChangedPayload {
  theme_params: Record<string, unknown>;
}

export interface ViewportChangedPayload {
  height: number;
  width: number;
  is_expanded: boolean;
  is_state_stable: boolean;
}

export interface PopupClosedPayload {
  button_id: string | null;
}

export interface InvoiceClosedPayload {
  slug: string;
  status: 'paid' | 'failed' | 'pending' | 'cancelled' | string;
}

/**
 * Map where key is known event name, and value is its listener.
 */
export interface BridgeEventsMap {
  /**
   * User clicked back button.
   * @since Web App version 6.1+
   */
  back_button_pressed: () => void;

  /**
   * Invoice was closed.
   * @param payload - invoice close information.
   */
  invoice_closed: (payload: InvoiceClosedPayload) => void;

  /**
   * User clicked main button.
   */
  main_button_pressed: () => void;

  /**
   * Popup was closed.
   * @param payload - popup close information.
   */
  popup_closed: (payload: PopupClosedPayload) => void;

  /**
   * Telegram requested to update current application style.
   * @param html - `style` tag inner HTML.
   */
  set_custom_style: (html: string) => void;

  /**
   * Occurs when the Settings item in context menu is pressed.
   * @since Web App version 6.1+
   */
  settings_button_pressed: () => void;

  /**
   * Occurs whenever theme settings are changed in the user's Telegram app
   * (including switching to night mode).
   *
   * @param payload - theme information.
   */
  theme_changed: (payload: ThemeChangedPayload) => void;

  /**
   * Viewport was changed.
   * @param payload - viewport information.
   */
  viewport_changed: (payload: ViewportChangedPayload) => void;
}

/**
 * Bridge event name which could be listened.
 */
export type BridgeEventName = EventNames<BridgeEventsMap>;

/**
 * Returns listener for specified event name.
 */
export type BridgeEventListener<E extends BridgeEventName> =
  EventListener<BridgeEventsMap[E]>;
