import type { RGB } from '@telegram-apps/types';

import type {
  PhoneRequestedStatus,
  InvoiceStatus,
  WriteAccessRequestedStatus,
  BiometryAuthRequestStatus,
  BiometryType,
  BiometryTokenUpdateStatus,
} from './misc.js';

/**
 * Map where key is known event name, and value is its listener.
 * @see https://docs.telegram-mini-apps.com/platform/events
 */
export interface Events {
  /**
   * User clicked the BackButton.
   * @since v6.1
   * @see https://docs.telegram-mini-apps.com/platform/events#back-button-pressed
   */
  back_button_pressed: never;
  /**
   * Biometry authentication request completed.
   * @since 7.2
   * @see https://docs.telegram-mini-apps.com/platform/events#biometry-auth-requested
   */
  biometry_auth_requested: {
    /**
     * Authentication status.
     */
    status: BiometryAuthRequestStatus;
    /**
     * Token from the local secure storage saved previously.
     */
    token?: string;
  };
  /**
   * Biometry settings were received.
   * @since 7.2
   * @see https://docs.telegram-mini-apps.com/platform/events#biometry-info-received
   */
  biometry_info_received:
    | {
    /**
     * If true, indicates that biometric authentication is available on the current device.
     */
    available: false;
  }
    | {
    /**
     * If true, indicates that biometric authentication is available on the current device.
     */
    available: true;
    /**
     * Indicates whether the app has previously requested permission to use biometrics.
     */
    access_requested: boolean;
    /**
     * Indicates whether the user has granted the app permission to use biometrics.
     *
     * If false and access_requested is true may indicate that:
     *
     * - The user has simply canceled the permission popup, in which case
     * a `web_app_biometry_request_access` event can be emitted to re-open the popup.
     *
     * - The user has denied the app permission to use biometrics, in which case the app should
     * open a prompt notifying the user that the biometric settings must be changed to use
     * biometrics.
     */
    access_granted: boolean;
    /**
     * A unique device identifier that can be used to match the token to the device.
     */
    device_id: string;
    /**
     * Show whether a token was safely stored on-device.
     */
    token_saved: boolean;
    /**
     * The type of biometrics currently available on the device.
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
     *
     * One of:
     * - `updated` - If the token was successfully updated.
     * - `removed` - If the token was successfully removed.
     * - `failed` - If biometric authentication failed, or the app doesn't have permission to
     * use biometrics.
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
    req_id: string;
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
    req_id: string;
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
   * A user clicked the Main Button.
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
    data: string;
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
   * User clicked the secondary button.
   * @since v7.10
   * @see https://docs.telegram-mini-apps.com/platform/events#secondary-button-pressed
   */
  secondary_button_pressed: never;
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
      /**
       * @since 7.10
       */
      bottom_bar_bg_color?: RGB;
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
export type EventName = keyof Events;

/**
 * Payload of the specified Mini Apps event.
 */
export type EventPayload<E extends EventName> = Events[E];
