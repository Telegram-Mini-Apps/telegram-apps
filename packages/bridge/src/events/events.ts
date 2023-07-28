import type {
  EventEmitter as UtilEventEmitter,
  EventName as UtilEventName,
  EventListener as UtilEventListener,
  EventParams as UtilEventParams,
} from '@twa.js/utils';

import type {
  ClipboardTextReceivedPayload,
  InvoiceClosedPayload,
  PopupClosedPayload,
  QrTextReceivedPayload,
  ThemeChangedPayload,
  ViewportChangedPayload,
} from './payloads.js';

/**
 * Map where key is known event name, and value is its listener.
 * @see Documentation https://docs.twa.dev/docs/apps-communication/events
 */
export interface Events {
  /**
   * User clicked back button.
   * @see https://docs.twa.dev/docs/apps-communication/events#back_button_pressed
   */
  back_button_pressed: () => void;

  /**
   * Text was extracted from clipboard.
   * @param payload - event information.
   * @see https://docs.twa.dev/docs/apps-communication/events#clipboard_text_received
   */
  clipboard_text_received: (payload: ClipboardTextReceivedPayload) => void;

  /**
   * Invoice was closed.
   * @param payload - invoice close information.
   * @see https://docs.twa.dev/docs/apps-communication/events#invoice_closed
   */
  invoice_closed: (payload: InvoiceClosedPayload) => void;

  /**
   * User clicked main button.
   * @see https://docs.twa.dev/docs/apps-communication/events#main_button_pressed
   */
  main_button_pressed: () => void;

  /**
   * Popup was closed.
   * @param payload - popup close information.
   * @see https://docs.twa.dev/docs/apps-communication/events#main_button_pressed
   */
  popup_closed: (payload: PopupClosedPayload) => void;

  /**
   * Data from QR was extracted.
   * @see https://docs.twa.dev/docs/apps-communication/events#qr_text_received
   */
  qr_text_received: (payload: QrTextReceivedPayload) => void;

  /**
   * QR scanner was closed.
   * @see https://docs.twa.dev/docs/apps-communication/events#scan_qr_popup_closed
   */
  scan_qr_popup_closed: () => void;

  /**
   * Telegram requested to update current application style.
   * @param html - `style` tag inner HTML.
   * @see https://docs.twa.dev/docs/apps-communication/events#set_custom_style
   */
  set_custom_style: (html: string) => void;

  /**
   * Occurs when the Settings item in context menu is pressed.
   * @see https://docs.twa.dev/docs/apps-communication/events#settings_button_pressed
   */
  settings_button_pressed: () => void;

  /**
   * Occurs whenever theme settings are changed in the user's Telegram app
   * (including switching to night mode).
   * @param payload - theme information.
   * @see https://docs.twa.dev/docs/apps-communication/events#theme_changed
   */
  theme_changed: (payload: ThemeChangedPayload) => void;

  /**
   * Viewport was changed.
   * @param payload - viewport information.
   * @see https://docs.twa.dev/docs/apps-communication/events#viewport_changed
   */
  viewport_changed: (payload: ViewportChangedPayload) => void;
}

/**
 * Any known event name.
 */
export type EventName = UtilEventName<Events>;

/**
 * Parameters of specified event.
 */
export type EventParams<E extends EventName> = UtilEventParams<Events[E]>[0];

/**
 * Returns event listener for specified event name.
 */
export type EventListener<E extends EventName> =
  UtilEventListener<Events[E]>;

/**
 * Event emitter, based describe events map.
 */
export type EventEmitter = UtilEventEmitter<Events>;
