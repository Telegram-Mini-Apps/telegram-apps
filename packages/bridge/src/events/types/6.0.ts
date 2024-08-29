import type { RGB } from '@telegram-apps/types';

export type InvoiceStatus =
  | 'paid'
  | 'failed'
  | 'pending'
  | 'cancelled'
  | string;

export interface Events60 {
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
   * Parent iframe requested current iframe reload.
   * @see https://docs.telegram-mini-apps.com/platform/events#reload-iframe
   */
  reload_iframe: never;
  /**
   * The event which is usually sent by the Telegram web application. Its payload represents
   * `<style/>` tag html content, a developer could use. The stylesheet described in the payload
   * will help the developer to stylize the app scrollbar (but he is still able to do it himself).
   * @see https://docs.telegram-mini-apps.com/platform/events#set-custom-style
   */
  set_custom_style: string;
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
}