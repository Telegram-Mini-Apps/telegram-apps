import type {
  AnySubscribeListener,
  EventEmitter,
  EventListener,
  EventParams,
} from '~/event-emitter/index.js';
import type { IsNever, Not } from '~/types/index.js';

import type {
  ClipboardTextReceivedPayload,
  CustomMethodInvokedPayload,
  InvoiceClosedPayload,
  PhoneRequestedPayload,
  PopupClosedPayload,
  QrTextReceivedPayload,
  ThemeChangedPayload,
  ViewportChangedPayload,
  WriteAccessRequestedPayload,
} from './parsers/index.js';

/**
 * Map where key is known event name, and value is its listener.
 * @see https://docs.telegram-mini-apps.com/platform/apps-communication/events
 */
export interface MiniAppsEvents {
  /**
   * User clicked back button.
   * @since v6.1
   * @see https://docs.telegram-mini-apps.com/platform/apps-communication/events#back-button-pressed
   */
  back_button_pressed: () => void;

  /**
   * Telegram application attempted to extract text from clipboard.
   * @param payload - event payload.
   * @since v6.4
   * @see https://docs.telegram-mini-apps.com/platform/apps-communication/events#clipboard-text-received
   */
  clipboard_text_received: (payload: ClipboardTextReceivedPayload) => void;

  /**
   * Custom method invocation completed.
   * @param payload - event payload.
   * @since v6.9
   * @see https://docs.telegram-mini-apps.com/platform/apps-communication/events#custom-method-invoked
   */
  custom_method_invoked: (payload: CustomMethodInvokedPayload) => void;

  /**
   * An invoice was closed.
   * @param payload - invoice close information.
   * @see https://docs.telegram-mini-apps.com/platform/apps-communication/events#invoice-closed
   */
  invoice_closed: (payload: InvoiceClosedPayload) => void;

  /**
   * User clicked the Main Button.
   * @see https://docs.telegram-mini-apps.com/platform/apps-communication/events#main-button-pressed
   */
  main_button_pressed: () => void;

  /**
   * Application received phone access request status.
   * @param payload - event payload.
   * @since v6.9
   * @see https://docs.telegram-mini-apps.com/platform/apps-communication/events#phone-requested
   */
  phone_requested: (payload: PhoneRequestedPayload) => void;

  /**
   * Popup was closed.
   * @param payload - event payload.
   * @see https://docs.telegram-mini-apps.com/platform/apps-communication/events#popup-closed
   */
  popup_closed: (payload: PopupClosedPayload) => void;

  /**
   * Parent iframe requested current iframe reload.
   * @see https://docs.telegram-mini-apps.com/platform/apps-communication/events#reload-iframe
   */
  reload_iframe: () => void;

  /**
   * The QR scanner scanned some QR and extracted its content.
   * @param payload - event payload.
   * @since v6.4
   * @see https://docs.telegram-mini-apps.com/platform/apps-communication/events#qr-text-received
   */
  qr_text_received: (payload: QrTextReceivedPayload) => void;

  /**
   * QR scanner was closed.
   * @since v6.4
   * @see https://docs.telegram-mini-apps.com/platform/apps-communication/events#scan-qr-popup-closed
   */
  scan_qr_popup_closed: () => void;

  /**
   * The event which is usually sent by the Telegram web application. Its payload represents
   * `<style/>` tag html content, a developer could use. The stylesheet described in the payload
   * will help the developer to stylize the app scrollbar (but he is still able to do it himself).
   * @param html - `style` tag inner HTML.
   * @see https://docs.telegram-mini-apps.com/platform/apps-communication/events#set-custom-style
   */
  set_custom_style: (html: string) => void;

  /**
   * Occurs when the Settings Button was pressed.
   * @since v6.1
   * @see https://docs.telegram-mini-apps.com/platform/apps-communication/events#settings-button-pressed
   */
  settings_button_pressed: () => void;

  /**
   * Occurs whenever theme settings are changed in the user's Telegram app
   * (including switching to night mode).
   * @param payload - event payload.
   * @see https://docs.telegram-mini-apps.com/platform/apps-communication/events#theme-changed
   */
  theme_changed: (payload: ThemeChangedPayload) => void;

  /**
   * Occurs whenever the viewport has been changed. For example, when the user started
   * dragging the application or called the expansion method.
   * @param payload - event payload.
   * @see https://docs.telegram-mini-apps.com/platform/apps-communication/events#viewport-changed
   */
  viewport_changed: (payload: ViewportChangedPayload) => void;

  /**
   * Application received write access request status.
   * @param payload - event payload.
   * @since v6.9
   * @see https://docs.telegram-mini-apps.com/platform/apps-communication/events#write-access-requested
   */
  write_access_requested: (payload: WriteAccessRequestedPayload) => void;
}

/**
 * Any known event name.
 */
export type MiniAppsEventName = keyof MiniAppsEvents;

/**
 * Parameters of specified event.
 */
export type MiniAppsEventParams<E extends MiniAppsEventName> = EventParams<MiniAppsEvents[E]>[0];

/**
 * Returns event listener for specified event name.
 */
export type MiniAppsEventListener<E extends MiniAppsEventName> = EventListener<MiniAppsEvents[E]>;

/**
 * Event emitter, based describe events map.
 */
export type MiniAppsEventEmitter = EventEmitter<MiniAppsEvents>;

/**
 * Returns true in case, event has parameters.
 */
export type MiniAppsEventHasParams<E extends MiniAppsEventName> =
  Not<IsNever<MiniAppsEventParams<E>>>;

/**
 * Event listener used in `subscribe` and `unsubscribe` functions.
 */
export type MiniAppsGlobalEventListener =
  | AnySubscribeListener<MiniAppsEvents>
  | ((event: string, data: unknown) => void);
