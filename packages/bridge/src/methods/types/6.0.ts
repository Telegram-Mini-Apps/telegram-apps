import type { CreateParams } from './utils.js';

/**
 * Values expected by the `web_app_open_link.try_browser` option.
 */
export type OpenLinkBrowser =
  | 'google-chrome'
  | 'chrome'
  | 'mozilla-firefox'
  | 'firefox'
  | 'microsoft-edge'
  | 'edge'
  | 'opera'
  | 'opera-mini'
  | 'brave'
  | 'brave-browser'
  | 'duckduckgo'
  | 'duckduckgo-browser'
  | 'samsung'
  | 'samsung-browser'
  | 'vivaldi'
  | 'vivaldi-browser'
  | 'kiwi'
  | 'kiwi-browser'
  | 'uc'
  | 'uc-browser'
  | 'tor'
  | 'tor-browser';

export interface Methods60 {
  /**
   * Notifies parent iframe about the current frame is ready. This method is only used in the Web
   * version of Telegram. As a result, Mini App will receive `set_custom_style` event.
   * @see https://docs.telegram-mini-apps.com/platform/methods#iframe-ready
   */
  iframe_ready: CreateParams<{
    /**
     * True, if the current Mini App supports native reloading.
     */
    reload_supported?: boolean;
  } | undefined>;
  /**
   * Notifies parent iframe about the current iframe is going to reload.
   * @see https://docs.telegram-mini-apps.com/platform/methods#iframe-will-reload
   */
  iframe_will_reload: CreateParams;
  /**
   * Closes Mini App.
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-close
   */
  web_app_close: CreateParams<{
    /**
     * Should the client return to the previous activity.
     * @since v7.6
     */
    return_back?: boolean;
  } | undefined, 'return_back'>;
  /**
   * Sends data to the bot. When this method is called, a service message is sent to the bot
   * containing the data of the length up to 4096 bytes. Then, Mini App will be closed.
   *
   * To get more information, take a look at `web_app_data` field in the
   * class [Message](https://core.telegram.org/bots/api#message).
   *
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-data-send
   */
  web_app_data_send: CreateParams<{
    /**
     * Data to send to a bot. Should not have size of more than 4096 bytes.
     */
    data: string;
  }>;
  /**
   * Expands the Mini App.
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-expand
   */
  web_app_expand: CreateParams;
  /**
   * Opens a link in a default browser. The Mini App will not be closed.
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-open-link
   */
  web_app_open_link: CreateParams<{
    /**
     * URL to be opened by Telegram application. Should be a full path with `https` protocol.
     */
    url: string;
    /**
     * Link will be opened in Instant View mode if possible.
     * @since v6.4
     * @see https://instantview.telegram.org/
     */
    try_instant_view?: boolean;
    /**
     * A preferred browser to open the link in.
     * @since v7.6
     */
    try_browser?: OpenLinkBrowser;
  }, 'try_instant_view' | 'try_browser'>;
  /**
   * Notifies Telegram about current application is ready to be shown. This method will make
   * Telegram to remove application loader and display Mini App.
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-ready
   */
  web_app_ready: CreateParams;
  /**
   * Requests current theme from Telegram. As a result, Telegram will create `theme_changed` event.
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-request-theme
   */
  web_app_request_theme: CreateParams;
  /**
   * Requests current viewport information from Telegram. As a result, Telegram will create
   * `viewport_changed` event.
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-request-viewport
   */
  web_app_request_viewport: CreateParams;
  /**
   * Updates current closing behavior.
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-setup-closing-behavior
   */
  web_app_setup_closing_behavior: CreateParams<{
    /**
     * Will user be prompted in case, an application is going to be closed.
     */
    need_confirmation: boolean;
  }>;
  /**
   * Updates the Main Button settings.
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-setup-main-button
   */
  web_app_setup_main_button: CreateParams<{
    /**
     * Should the Main Button be displayed.
     */
    is_visible?: boolean;
    /**
     * Should the Main Button be enabled.
     */
    is_active?: boolean;
    /**
     * Should loader inside the Main Button be displayed. Use this property in case, some
     * operation takes time. This loader will make user notified about it.
     */
    is_progress_visible?: boolean;
    /**
     * Text inside the Main Button.
     */
    text?: string;
    /**
     * The Main Button background color in `#RRGGBB` format.
     */
    color?: string;
    /**
     * The Main Button text color in `#RRGGBB` format.
     */
    text_color?: string;
  }>;
}