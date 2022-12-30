import {EventNames, EventListener} from 'twa-core';
import {InvoiceClosedPayload} from './invoice';
import {PopupClosedPayload} from './popup';
import {ViewportChangedPayload} from './viewport';
import {ThemeChangedPayload} from './theme';
import {ClipboardTextReceivedPayload} from './clipboard';
import {QrTextReceivedPayload} from './qr';

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
   * @param payload - theme information.
   */
  theme_changed: (payload: ThemeChangedPayload) => void;

  /**
   * Viewport was changed.
   * @param payload - viewport information.
   */
  viewport_changed: (payload: ViewportChangedPayload) => void;

  /**
   * Data from QR was extracted.
   * @since Web App version 6.4+
   */
  qr_text_received: (payload: QrTextReceivedPayload) => void;

  /**
   * QR scanner was closed.
   * @since Web App version 6.4+
   */
  scan_qr_popup_closed: () => void;

  /**
   * Text was extracted from clipboard.
   * @since Web App version 6.4+
   * @param payload - event information
   */
  clipboard_text_received: (payload: ClipboardTextReceivedPayload) => void;
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
