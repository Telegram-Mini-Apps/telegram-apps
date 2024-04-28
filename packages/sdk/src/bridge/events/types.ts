import type { RGB } from '@/colors/types.js';
import type { EventEmitter } from '@/events/event-emitter/EventEmitter.js';
import type { EventListener, SubscribeListener } from '@/events/event-emitter/types.js';
import type { RequestId } from '@/request-id/types.js';

export type InvoiceStatus =
  | 'paid'
  | 'failed'
  | 'pending'
  | 'cancelled'
  | string;

export type PhoneRequestedStatus = 'sent' | 'cancelled' | string;

export type WriteAccessRequestedStatus = 'allowed' | string;

export type BiometryType = 'finger' | 'face';

export type BiometryTokenUpdateStatus = 'updated' | 'removed';

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
  back_button_pressed: never;
  /**
   * Biometry authorization completed. If authorization was successful, event contains
   * previously saved token.
   * @since 7.2
   * @see https://docs.telegram-mini-apps.com/platform/events#biometry-auth-requested
   */
  biometry_auth_requested:
    | {
    /**
     * Authorization status.
     */
    status: 'failed';
  }
    | {
    /**
     * Authorization status.
     */
    status: 'authorized';
    /**
     * Token, saved previously.
     */
    token: string;
  };
  /**
   * Biometry settings were received.
   * @since 7.2
   * @see https://docs.telegram-mini-apps.com/platform/events#biometry-info-received
   */
  biometry_info_received:
    | {
    /**
     * True, if biometry is available.
     */
    available: false;
  }
    | {
    /**
     * `true`, if biometry is available.
     */
    available: true;
    /**
     * `true`, if access was requested previously.
     */
    access_requested: boolean;
    /**
     * `true`, if access was granted previously.
     */
    access_granted: boolean;
    /**
     * Current device identifier.
     */
    device_id: string;
    /**
     * `true`, if local storage contains previously saved token.
     */
    token_saved: boolean;
    /**
     * Supported biometry type.
     */
    type: BiometryType;
  };
  /**
   * Biometry token was updated.
   * @since 7.2
   * @see https://docs.telegram-mini-apps.com/platform/events#biometry-token-updated
   */
  biometry_token_updated: {
    /**
     * Update status.
     */
    status: BiometryTokenUpdateStatus;
  };
  /**
   * Telegram application attempted to extract text from clipboard.
   * @since v6.4
   * @see https://docs.telegram-mini-apps.com/platform/events#clipboard-text-received
   */
  clipboard_text_received: {
    /**
     * Passed during the `web_app_read_text_from_clipboard` method invocation `req_id` value.
     */
    req_id: RequestId;
    /**
     * Data extracted from the clipboard. The returned value will have the type `string` only in
     * the case, application has access to the clipboard.
     */
    data?: string | null;
  };
  /**
   * Custom method invocation completed.
   * @since v6.9
   * @see https://docs.telegram-mini-apps.com/platform/events#custom-method-invoked
   */
  custom_method_invoked: {
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
  };
  /**
   * An invoice was closed.
   * @see https://docs.telegram-mini-apps.com/platform/events#invoice-closed
   */
  invoice_closed: {
    /**
     * Passed during the `web_app_open_invoice` method invocation `slug` value.
     */
    slug: string;
    /**
     * Invoice status.
     */
    status: InvoiceStatus;
  };
  /**
   * User clicked the Main Button.
   * @see https://docs.telegram-mini-apps.com/platform/events#main-button-pressed
   */
  main_button_pressed: never;
  /**
   * Application received phone access request status.
   * @since v6.9
   * @see https://docs.telegram-mini-apps.com/platform/events#phone-requested
   */
  phone_requested: {
    /**
     * Request status.
     */
    status: PhoneRequestedStatus;
  };
  /**
   * Popup was closed.
   * @see https://docs.telegram-mini-apps.com/platform/events#popup-closed
   */
  popup_closed: {
    /**
     * Identifier of the clicked button. In case, the popup was closed without clicking any button,
     * this property will be omitted.
     */
    button_id?: string;
  };
  /**
   * The QR scanner scanned some QR and extracted its content.
   * @param payload - event payload.
   * @since v6.4
   * @see https://docs.telegram-mini-apps.com/platform/events#qr-text-received
   */
  qr_text_received: {
    /**
     * Data extracted from the QR.
     */
    data?: string;
  };
  /**
   * Parent iframe requested current iframe reload.
   * @see https://docs.telegram-mini-apps.com/platform/events#reload-iframe
   */
  reload_iframe: never;
  /**
   * QR scanner was closed.
   * @since v6.4
   * @see https://docs.telegram-mini-apps.com/platform/events#scan-qr-popup-closed
   */
  scan_qr_popup_closed: never;
  /**
   * The event which is usually sent by the Telegram web application. Its payload represents
   * `<style/>` tag html content, a developer could use. The stylesheet described in the payload
   * will help the developer to stylize the app scrollbar (but he is still able to do it himself).
   * @see https://docs.telegram-mini-apps.com/platform/events#set-custom-style
   */
  set_custom_style: string;
  /**
   * Occurs when the Settings Button was pressed.
   * @since v6.1
   * @see https://docs.telegram-mini-apps.com/platform/events#settings-button-pressed
   */
  settings_button_pressed: never;
  /**
   * Occurs whenever theme settings are changed in the user's Telegram app
   * (including switching to night mode).
   * @see https://docs.telegram-mini-apps.com/platform/events#theme-changed
   */
  theme_changed: {
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
  };
  /**
   * Occurs whenever the viewport has been changed. For example, when the user started
   * dragging the application or called the expansion method.
   * @see https://docs.telegram-mini-apps.com/platform/events#viewport-changed
   */
  viewport_changed: {
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
  };
  /**
   * Application received write access request status.
   * @since v6.9
   * @see https://docs.telegram-mini-apps.com/platform/events#write-access-requested
   */
  write_access_requested: {
    /**
     * Request status.
     */
    status: WriteAccessRequestedStatus;
  };
}

/**
 * Mini Apps event name.
 */
export type MiniAppsEventName = keyof MiniAppsEvents;

/**
 * Payload of the specified Mini Apps event.
 */
export type MiniAppsEventPayload<E extends MiniAppsEventName> = MiniAppsEvents[E];

/**
 * Returns event listener for the specified Mini Apps event.
 */
export type MiniAppsEventListener<E extends MiniAppsEventName> = EventListener<MiniAppsEvents[E]>;

/**
 * Mini Apps event listener used in `subscribe` and `unsubscribe` functions.
 */
export type MiniAppsSubscribeListener = SubscribeListener<MiniAppsEvents>;

/**
 * Mini Apps event emitter.
 */
export type MiniAppsEventEmitter = EventEmitter<MiniAppsEvents>;
