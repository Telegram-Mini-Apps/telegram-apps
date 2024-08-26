import type { RGB } from '@telegram-apps/types';

import type { CreateParams } from './utils.js';

/**
 * Generic type which creates new types of haptic feedback.
 */
type CreateHapticFeedbackParams<T extends string, P> = { type: T } & P;

/**
 * Style of impact occurred haptic event.
 * - `light`, indicates a collision between small or lightweight UI objects,
 * - `medium`, indicates a collision between medium-sized or medium-weight UI objects,
 * - `heavy`, indicates a collision between large or heavyweight UI objects,
 * - `rigid`, indicates a collision between hard or inflexible UI objects,
 * - `soft`, indicates a collision between soft or flexible UI objects.
 */
export type ImpactHapticFeedbackStyle =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'rigid'
  | 'soft';

/**
 * Type of notification occurred type event.
 * - `error`, indicates that a task or action has failed,
 * - `success`, indicates that a task or action has completed successfully,
 * - `warning`, indicates that a task or action produced a warning.
 */
export type NotificationHapticFeedbackType = 'error' | 'success' | 'warning';

/**
 * `impactOccurred` haptic feedback.
 */
export type ImpactHapticFeedbackParams = CreateHapticFeedbackParams<'impact', {
  impact_style: ImpactHapticFeedbackStyle;
}>;

/**
 * `notificationOccurred` haptic feedback.
 */
export type NotificationHapticFeedbackParams = CreateHapticFeedbackParams<'notification', {
  notification_type: NotificationHapticFeedbackType;
}>;

/**
 * `selectionChanged` haptic feedback.
 */
export type SelectionHapticFeedbackParams = CreateHapticFeedbackParams<'selection_change', {}>;

export type AnyHapticFeedbackParams =
  | ImpactHapticFeedbackParams
  | NotificationHapticFeedbackParams
  | SelectionHapticFeedbackParams;

/**
 * Color key which could be used to update header color.
 */
export type HeaderColorKey = 'bg_color' | 'secondary_bg_color';

export interface Methods61 {
  /**
   * Opens an invoice by its specified slug. More information about invoices in
   * this [documentation](https://core.telegram.org/bots/payments).
   * @since v6.1
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-open-invoice
   */
  web_app_open_invoice: CreateParams<{
    /**
     * Invoice unique identifier.
     */
    slug: string;
  }>;
  /**
   * Generates haptic feedback event.
   * @since v6.1
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-trigger-haptic-feedback
   */
  web_app_trigger_haptic_feedback: CreateParams<AnyHapticFeedbackParams>;
  /**
   * Opens the Telegram link by its pathname and query parameters. The link will be opened in the
   * Telegram app, Mini App will be closed.
   * @since v6.1
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-open-tg-link
   */
  web_app_open_tg_link: CreateParams<{
    /**
     * Should be a value taken from the link of this format: `https://t.me/{path_full}`. Can
     * additionally contain query parameters.
     */
    path_full: string;
  }>;
  /**
   * Updates the Mini App background color.
   * @since v6.1
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-set-background-color
   */
  web_app_set_background_color: CreateParams<{
    /**
     * The Mini App background color in `#RRGGBB` format.
     */
    color: RGB;
  }>;
  /**
   * Updates the Mini App header color.
   * @since v6.1
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-set-header-color
   */
  web_app_set_header_color: CreateParams<
    | {
    /**
     * The Mini App header color key.
     */
    color_key: HeaderColorKey
  }
    | {
    /**
     * Color in RGB format.
     * @since v6.9
     */
    color: RGB;
  }, 'color'>;
  /**
   * Updates the Back Button settings.
   * @since v6.1
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-setup-back-button
   */
  web_app_setup_back_button: CreateParams<{
    /**
     * Should the Back Button be visible.
     */
    is_visible: boolean;
  }>;
}