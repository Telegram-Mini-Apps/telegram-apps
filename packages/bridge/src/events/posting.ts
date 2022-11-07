import {
  ImpactHapticFeedback,
  NotificationHapticFeedback,
  SelectionHapticFeedback,
} from './haptic';
import {PopupParams} from './popup';
import {IsNever} from 'twa-core';

/**
 * Describes list of events and their parameters that could be posted by
 * Bridge.
 */
export interface BridgePostEventParamsMap {
  /**
   * Notifies parent iframe about current frame is ready.
   */
  iframe_ready: never;

  /**
   * Closes WebApp.
   */
  web_app_close: never;

  /**
   * Sends data to bot.
   */
  web_app_data_send: { data: string };

  /**
   * Expands WebApp.
   */
  web_app_expand: never;

  /**
   * Opens link in default browser. Doesn't close application.
   */
  web_app_open_link: { url: string };

  /**
   * Opens link which has format like "https://t.me/*".
   * @since Web App version 6.1+
   */
  web_app_open_tg_link: { path_full: string };

  /**
   * Opens new popup.
   * @since Web App version 6.2+
   */
  web_app_open_popup: PopupParams;

  /**
   * Opens new invoice.
   * @since Web App version 6.1+
   */
  web_app_open_invoice: { slug: string };

  /**
   * Notifies Telegram about current application is ready to be shown.
   */
  web_app_ready: never;

  /**
   * Requests current theme from Telegram.
   */
  web_app_request_theme: never;

  /**
   * Requests current viewport information from Telegram.
   */
  web_app_request_viewport: never;

  /**
   * Updates current information about back button.
   * @since Web App version 6.1+
   */
  web_app_setup_back_button: { is_visible: boolean };

  /**
   * Updates current information about main button.
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
   */
  web_app_setup_closing_behavior: { need_confirmation: boolean };

  /**
   * Updates current background color.
   * @since Web App version 6.1+
   */
  web_app_set_background_color: { color: string };

  /**
   * Updates current header color.
   * @since Web App version 6.1+
   */
  web_app_set_header_color: { color_key: string };

  /**
   * Generates haptic feedback events.
   * @since Web App version 6.1+
   */
  web_app_trigger_haptic_feedback:
    | ImpactHapticFeedback
    | NotificationHapticFeedback
    | SelectionHapticFeedback;
}

/**
 * Any post-available event name.
 */
export type BridgePostEventName = keyof BridgePostEventParamsMap;

/**
 * Returns parameters for specified post-available event.
 */
export type BridgePostEventParams<E extends BridgePostEventName> =
  BridgePostEventParamsMap[E];

/**
 * Any post-available event name which does not require arguments.
 */
export type BridgePostEmptyEventName = {
  [E in BridgePostEventName]: IsNever<BridgePostEventParams<E>> extends true
    ? E
    : never;
}[BridgePostEventName];

/**
 * Any post-available event name which require arguments.
 */
export type BridgePostNonEmptyEventName =
  Exclude<BridgePostEventName, BridgePostEmptyEventName>;
