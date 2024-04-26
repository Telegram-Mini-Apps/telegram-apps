import type { RGB } from '@/colors/types.js';
import type { EventEmitter } from '@/events/event-emitter/EventEmitter.js';
import type {
  EventListener,
  EventParams,
  SubscribeListener,
} from '@/events/event-emitter/types.js';
import type { RequestId } from '@/request-id/types.js';

export type InvoiceStatus =
  | 'paid'
  | 'failed'
  | 'pending'
  | 'cancelled'
  | string;

export type PhoneRequestedStatus = 'sent' | 'cancelled' | string;

export type WriteAccessRequestedStatus = 'allowed' | string;

/**
 * Map where key is known event name, and value is its listener.
 * @see https://docs.telegram-mini-apps.com/platform/events
 */
export interface MiniAppsEvents {
  /**
   * User clicked back button.
   * @since v6.1
   * @see https://docs.telegram-mini-apps.com/platform/events#back-button-pressed
   */
  back_button_pressed: () => void;
  /**
   * fixme
   * @since 7.2
   */
  biometry_auth_requested: {
    status: 'authorized' | string;
    token?: string;
  };
  /**
   * fixme
   * @since 7.2
   */
  biometry_info_received:
    | { available: false }
    | {
    available: true;
    access_requested: boolean;
    access_granted: boolean;
    device_id: string;
    token_saved: boolean;
    type: 'finger' | 'face' | 'unknown' | string;
  };
  /**
   * fixme
   * @since 7.2
   */
  biometry_token_updated: {
    status: 'updated' | 'removed' | string;
  };
  /**
   * Telegram application attempted to extract text from clipboard.
   * @param payload - event payload.
   * @since v6.4
   * @see https://docs.telegram-mini-apps.com/platform/events#clipboard-text-received
   */
  clipboard_text_received: (payload: {
    /**
     * Passed during the `web_app_read_text_from_clipboard` method invocation `req_id` value.
     */
    req_id: RequestId;
    /**
     * Data extracted from the clipboard. The returned value will have the type `string` only in
     * the case, application has access to the clipboard.
     */
    data?: string | null;
  }) => void;
  /**
   * Custom method invocation completed.
   * @param payload - event payload.
   * @since v6.9
   * @see https://docs.telegram-mini-apps.com/platform/events#custom-method-invoked
   */
  custom_method_invoked: (payload: {
    /**
     * Unique identifier of this invocation.
     */
    req_id: RequestId;
    /**
     * Method invocation successful result.
     */
    result?: unknown;
    /**
     * Method invocation error code.
     */
    error?: string;
  }) => void;
  /**
   * An invoice was closed.
   * @param payload - invoice close information.
   * @see https://docs.telegram-mini-apps.com/platform/events#invoice-closed
   */
  invoice_closed: (payload: {
    /**
     * Passed during the `web_app_open_invoice` method invocation `slug` value.
     */
    slug: string;
    /**
     * Invoice status.
     */
    status: InvoiceStatus;
  }) => void;
  /**
   * User clicked the Main Button.
   * @see https://docs.telegram-mini-apps.com/platform/events#main-button-pressed
   */
  main_button_pressed: () => void;
  /**
   * Application received phone access request status.
   * @param payload - event payload.
   * @since v6.9
   * @see https://docs.telegram-mini-apps.com/platform/events#phone-requested
   */
  phone_requested: (payload: {
    /**
     * Request status.
     */
    status: PhoneRequestedStatus;
  }) => void;
  /**
   * Popup was closed.
   * @param payload - event payload.
   * @see https://docs.telegram-mini-apps.com/platform/events#popup-closed
   */
  popup_closed: (payload: {
    /**
     * Identifier of the clicked button. In case, the popup was closed without clicking any button,
     * this property will be omitted.
     */
    button_id?: string;
  }) => void;
  /**
   * The QR scanner scanned some QR and extracted its content.
   * @param payload - event payload.
   * @since v6.4
   * @see https://docs.telegram-mini-apps.com/platform/events#qr-text-received
   */
  qr_text_received: (payload: {
    /**
     * Data extracted from the QR.
     */
    data?: string;
  }) => void;
  /**
   * Parent iframe requested current iframe reload.
   * @see https://docs.telegram-mini-apps.com/platform/events#reload-iframe
   */
  reload_iframe: () => void;
  /**
   * QR scanner was closed.
   * @since v6.4
   * @see https://docs.telegram-mini-apps.com/platform/events#scan-qr-popup-closed
   */
  scan_qr_popup_closed: () => void;
  /**
   * The event which is usually sent by the Telegram web application. Its payload represents
   * `<style/>` tag html content, a developer could use. The stylesheet described in the payload
   * will help the developer to stylize the app scrollbar (but he is still able to do it himself).
   * @param html - `style` tag inner HTML.
   * @see https://docs.telegram-mini-apps.com/platform/events#set-custom-style
   */
  set_custom_style: (html: string) => void;
  /**
   * Occurs when the Settings Button was pressed.
   * @since v6.1
   * @see https://docs.telegram-mini-apps.com/platform/events#settings-button-pressed
   */
  settings_button_pressed: () => void;
  /**
   * Occurs whenever theme settings are changed in the user's Telegram app
   * (including switching to night mode).
   * @param payload - event payload.
   * @see https://docs.telegram-mini-apps.com/platform/events#theme-changed
   */
  theme_changed: (payload: {
    /**
     * Map where the key is a theme stylesheet key and value is  the corresponding color in
     * `#RRGGBB` format.
     */
    theme_params: {
      /**
       * @since v6.10
       */
      accent_text_color?: RGB;
      bg_color?: RGB;
      button_color?: RGB;
      button_text_color?: RGB;
      /**
       * @since v6.10
       */
      destructive_text_color?: RGB;
      /**
       * @since v6.10
       */
      header_bg_color?: RGB;
      hint_color?: RGB;
      link_color?: RGB;
      secondary_bg_color?: RGB;
      /**
       * @since v6.10
       */
      section_bg_color?: RGB;
      /**
       * @since v6.10
       */
      section_header_text_color?: RGB;
      /**
       * @since v6.10
       */
      subtitle_text_color?: RGB;
      text_color?: RGB;
      [key: string]: RGB | undefined; // Future unknown palette keys.
    };
  }) => void;
  /**
   * Occurs whenever the viewport has been changed. For example, when the user started
   * dragging the application or called the expansion method.
   * @param payload - event payload.
   * @see https://docs.telegram-mini-apps.com/platform/events#viewport-changed
   */
  viewport_changed: (payload: {
    /**
     * The viewport height.
     */
    height: number;
    /**
     * The viewport width.
     */
    width: number;
    /**
     * Is the viewport currently expanded.
     */
    is_expanded: boolean;
    /**
     * Is the viewport current state stable and not going to change in the next moment.
     */
    is_state_stable: boolean;
  }) => void;
  /**
   * Application received write access request status.
   * @param payload - event payload.
   * @since v6.9
   * @see https://docs.telegram-mini-apps.com/platform/events#write-access-requested
   */
  write_access_requested: (payload: {
    /**
     * Request status.
     */
    status: WriteAccessRequestedStatus;
  }) => void;
}

/**
 * Any known event name.
 */
export type MiniAppsEventName = keyof MiniAppsEvents;

/**
 * Parameters of the specified event.
 */
export type MiniAppsEventPayload<E extends MiniAppsEventName> = EventParams<MiniAppsEvents[E]>[0];

/**
 * Returns event listener for specified event name.
 */
export type MiniAppsEventListener<E extends MiniAppsEventName> = EventListener<MiniAppsEvents[E]>;

/**
 * Event listener used in `subscribe` and `unsubscribe` functions.
 */
export type MiniAppsSubscribeListener = SubscribeListener<MiniAppsEvents>;

/**
 * MiniApps event emitter.
 */
export type MiniAppsEventEmitter = EventEmitter<MiniAppsEvents>;
