import {PopupParams} from '../events';
import {IsNever} from 'twa-core';
import {
  ImpactHapticFeedback,
  NotificationHapticFeedback,
  SelectionHapticFeedback,
} from './haptic';

/**
 * Describes list of events and their parameters that could be posted by
 * Bridge.
 * @see https://corefork.telegram.org/api/web-events#event-types
 */
export interface PostEventParamsMap {
  /**
   * Notifies parent iframe about current frame is ready.
   */
  iframe_ready: never;

  /**
   * Closes WebApp.
   * @see https://corefork.telegram.org/api/web-events#web-app-close
   */
  web_app_close: never;

  /**
   * Sends data to bot.
   * @see https://corefork.telegram.org/api/web-events#web-app-data-send
   */
  web_app_data_send: { data: string };

  /**
   * Expands Web App.
   * @see https://corefork.telegram.org/api/web-events#web-app-expand
   */
  web_app_expand: never;

  /**
   * Opens link in default browser. Doesn't close application.
   * @see https://corefork.telegram.org/api/web-events#web-app-open-link
   */
  web_app_open_link: { url: string };

  /**
   * Opens link which has format like "https://t.me/*".
   * @since Web App version 6.1+
   * @see https://corefork.telegram.org/api/web-events#web-app-open-tg-link
   */
  web_app_open_tg_link: { path_full: string };

  /**
   * Opens new popup.
   * @since Web App version 6.2+
   * @see https://corefork.telegram.org/api/web-events#web-app-open-popup
   */
  web_app_open_popup: PopupParams;

  /**
   * Opens new invoice.
   * @since Web App version 6.1+
   * @see https://corefork.telegram.org/api/web-events#web-app-open-invoice
   */
  web_app_open_invoice: { slug: string };

  /**
   * Notifies Telegram about current application is ready to be shown.
   * @see https://corefork.telegram.org/api/web-events#web-app-ready
   */
  web_app_ready: never;

  /**
   * Requests current theme from Telegram.
   * @see https://corefork.telegram.org/api/web-events#web-app-request-theme
   */
  web_app_request_theme: never;

  /**
   * Requests current viewport information from Telegram.
   * @see https://corefork.telegram.org/api/web-events#web-app-request-viewport
   */
  web_app_request_viewport: never;

  /**
   * Updates current information about back button.
   * @since Web App version 6.1+
   * @see https://corefork.telegram.org/api/web-events#web-app-setup-back-button
   */
  web_app_setup_back_button: { is_visible: boolean };

  /**
   * Updates current information about main button.
   * @see https://corefork.telegram.org/api/web-events#web-app-setup-main-button
   */
  web_app_setup_main_button: {
    is_visible?: boolean;
    is_active?: boolean;
    is_progress_visible?: boolean;
    text?: string;
    color?: string;
    text_color?: string;
  };

  /**
   * Changes current closing confirmation requirement status.
   * @see https://corefork.telegram.org/api/web-events#web-app-setup-closing-behavior
   */
  web_app_setup_closing_behavior: { need_confirmation: boolean };

  /**
   * Updates current background color.
   * @since Web App version 6.1+
   * @see https://corefork.telegram.org/api/web-events#web-app-set-background-color
   */
  web_app_set_background_color: { color: string };

  /**
   * Updates current header color.
   * @since Web App version 6.1+
   * @see https://corefork.telegram.org/api/web-events#web-app-set-header-color
   */
  web_app_set_header_color: { color_key: string };

  /**
   * Generates haptic feedback events.
   * @since Web App version 6.1+
   * @see https://corefork.telegram.org/api/web-events#web-app-trigger-haptic-feedback
   */
  web_app_trigger_haptic_feedback:
    | ImpactHapticFeedback
    | NotificationHapticFeedback
    | SelectionHapticFeedback;
}

/**
 * Any post-available event name.
 */
export type PostEventName = keyof PostEventParamsMap;

/**
 * Returns parameters for specified post-available event.
 */
export type PostEventParams<E extends PostEventName> =
  PostEventParamsMap[E];

/**
 * Any post-available event name which does not require arguments.
 */
export type PostEmptyEventName = {
  [E in PostEventName]: IsNever<PostEventParams<E>> extends true
    ? E
    : never;
}[PostEventName];

/**
 * Any post-available event name which require arguments.
 */
export type PostNonEmptyEventName =
  Exclude<PostEventName, PostEmptyEventName>;