import type { IsNever, RGB } from '@twa.js/utils';

import type { PopupParams } from './popup.js';
import type { AnyHapticFeedbackParams } from './haptic.js';
import type { RequestId } from '../shared.js';
import type { AnyInvokeCustomMethodParams } from './invoke-custom-method.js';

/**
 * Color key which could be used tot update header color.
 */
export type HeaderColorKey = 'bg_color' | 'secondary_bg_color';

type Keys<T> = T extends T ? keyof T : never;

type CreateParams<P = never, SupportCheck extends Keys<P> = never> = {
  params: P;
  canCheckSupport: SupportCheck;
};

/**
 * Describes list of events and their parameters that could be posted by
 * Bridge.
 * @see https://docs.twa.dev/docs/apps-communication/methods
 */
export interface MethodsParams {
  /**
   * Notifies parent iframe about current frame is ready.
   * @see https://docs.twa.dev/docs/apps-communication/methods#iframe_ready
   * @since 6.0
   */
  iframe_ready: CreateParams;

  /**
   * Closes WebApp.
   * @see https://docs.twa.dev/docs/apps-communication/methods#web_app_close
   * @since 6.0
   */
  web_app_close: CreateParams;

  /**
   * Sends data to bot.
   * @see https://docs.twa.dev/docs/apps-communication/methods#web_app_data_send
   * @since 6.0
   */
  web_app_data_send: CreateParams<{ data: string }>;

  /**
   * Expands Web App.
   * @see https://docs.twa.dev/docs/apps-communication/methods#web_app_expand
   * @since 6.0
   */
  web_app_expand: CreateParams;

  /**
   * Opens link in default browser. Doesn't close application.
   * @see https://docs.twa.dev/docs/apps-communication/methods#web_app_open_link
   * @since 6.0
   */
  web_app_open_link: CreateParams<{
    url: string,

    // TODO: Add to docs.
    /**
     * Link will be opened in Instant View mode if possible.
     * @see https://instantview.telegram.org/
     * @since 6.4
     */
    try_instant_view?: boolean;
  }, 'try_instant_view'>;

  /**
   * Opens link which has format like "https://t.me/*".
   * @see https://docs.twa.dev/docs/apps-communication/methods#web_app_open_tg_link
   * @since 6.1
   */
  web_app_open_tg_link: CreateParams<{ path_full: string }>;

  /**
   * Opens new popup.
   * @see https://docs.twa.dev/docs/apps-communication/methods#web_app_open_popup
   * @since 6.2
   */
  web_app_open_popup: CreateParams<PopupParams>;

  /**
   * Opens new invoice.
   * @see https://docs.twa.dev/docs/apps-communication/methods#web_app_open_invoice
   * @since 6.1
   */
  web_app_open_invoice: CreateParams<{ slug: string }>;

  /**
   * Notifies Telegram about current application is ready to be shown.
   * @see https://docs.twa.dev/docs/apps-communication/methods#web_app_ready
   * @since 6.0
   */
  web_app_ready: CreateParams;

  /**
   * Requests current theme from Telegram.
   * @see https://docs.twa.dev/docs/apps-communication/methods#web_app_request_theme
   * @since 6.0
   */
  web_app_request_theme: CreateParams;

  /**
   * Requests current viewport information from Telegram.
   * @see https://docs.twa.dev/docs/apps-communication/methods#web_app_request_viewport
   * @since 6.0
   */
  web_app_request_viewport: CreateParams;

  /**
   * Updates current information about back button.
   * @see https://docs.twa.dev/docs/apps-communication/methods#web_app_setup_back_button
   * @since 6.1
   */
  web_app_setup_back_button: CreateParams<{ is_visible: boolean }>;

  /**
   * Updates current information about main button.
   * @see https://docs.twa.dev/docs/apps-communication/methods#web_app_setup_main_button
   * @since 6.0
   */
  web_app_setup_main_button: CreateParams<{
    is_visible?: boolean;
    is_active?: boolean;
    is_progress_visible?: boolean;
    text?: string;
    color?: string;
    text_color?: string;
  }>;

  /**
   * Changes current closing confirmation requirement status.
   * @see https://docs.twa.dev/docs/apps-communication/methods#web_app_setup_closing_behavior
   * @since 6.0
   */
  web_app_setup_closing_behavior: CreateParams<{ need_confirmation: boolean }>;

  /**
   * Updates current background color.
   * @see https://docs.twa.dev/docs/apps-communication/methods#web_app_set_background_color
   * @since 6.1
   */
  web_app_set_background_color: CreateParams<{ color: string }>;

  /**
   * Updates current header color.
   * @see https://docs.twa.dev/docs/apps-communication/methods#web_app_set_header_color
   * @since 6.1
   */
  web_app_set_header_color: CreateParams<
    | { color_key: HeaderColorKey }
    | {
    /**
     * @since 6.10
     */
    color: RGB
  }, 'color'>;

  /**
   * Generates haptic feedback event.
   * @see https://docs.twa.dev/docs/apps-communication/methods#web_app_trigger_haptic_feedback
   * @since 6.1
   */
  web_app_trigger_haptic_feedback: CreateParams<AnyHapticFeedbackParams>;

  /**
   * Opens QR scanner.
   * @see https://docs.twa.dev/docs/apps-communication/methods#web_app_open_scan_qr_popup
   * @since 6.4
   */
  web_app_open_scan_qr_popup: CreateParams<{ text?: string }>;

  /**
   * Closes QR scanner.
   * @see https://docs.twa.dev/docs/apps-communication/methods#web_app_close_scan_qr_popup
   * @since 6.4
   */
  web_app_close_scan_qr_popup: CreateParams;

  /**
   * Reads text from clipboard.
   * @see https://docs.twa.dev/docs/apps-communication/methods#web_app_read_text_from_clipboard
   * @since 6.4
   */
  web_app_read_text_from_clipboard: CreateParams<{ req_id: RequestId }>;

  /**
   * Invokes custom method.
   * @since 6.9
   */
  web_app_invoke_custom_method: CreateParams<AnyInvokeCustomMethodParams>;

  /**
   * Requests access to current user's phone.
   * @since 6.9
   */
  web_app_request_phone: CreateParams;

  /**
   * Requests write message access to current user.
   * @since 6.9
   */
  web_app_request_write_access: CreateParams;
}

/**
 * Any post-available event name.
 */
export type MethodName = keyof MethodsParams;

/**
 * Returns parameters for specified post-available event.
 */
export type MethodParams<E extends MethodName> = MethodsParams[E]['params'];

/**
 * Any post-available event name which does not require arguments.
 */
export type EmptyMethodName = {
  [E in MethodName]: IsNever<MethodParams<E>> extends true ? E : never;
}[MethodName];

/**
 * Any post-available event name which require arguments.
 */
export type NonEmptyMethodName = Exclude<MethodName, EmptyMethodName>;

/**
 * Method names which could be used in supportsParam method.
 */
export type HaveCheckSupportMethodName = {
  [E in MethodName]: IsNever<MethodsParams[E]['canCheckSupport']> extends true ? never : E;
}[MethodName];

/**
 * Method parameter which can be checked via support method.
 */
export type HaveCheckSupportMethodParam<M extends HaveCheckSupportMethodName> = MethodsParams[M]['canCheckSupport'];
