import type { RGB, If, IsNever, UnionKeys } from '@telegram-apps/types';

import type { AnyInvokeCustomMethodParams } from './custom-methods.js';
import type { AnyHapticFeedbackParams } from './haptic.js';
import type { PopupParams } from './popup.js';

/**
 * Color key which could be used to update header color.
 */
export type HeaderColorKey = 'bg_color' | 'secondary_bg_color';

/**
 * Chat type which could be used when calling `web_app_switch_inline_query` method.
 */
export type SwitchInlineQueryChatType = 'users' | 'bots' | 'groups' | 'channels';

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

interface CreateParams<Params = never, VersionedParam extends UnionKeys<Params> = never> {
  params: Params;
  versionedParams: VersionedParam;
}

/**
 * Describes a list of events and their parameters that could be posted.
 * @see https://docs.telegram-mini-apps.com/platform/methods
 */
export interface Methods {
  /**
   * Notifies parent iframe about the current frame is ready. This method is only used in the Web
   * version of Telegram. As a result, Mini App will receive `set_custom_style` event.
   * @see https://docs.telegram-mini-apps.com/platform/methods#iframe-ready
   */
  iframe_ready: CreateParams<{
    /**
     * True, if current Mini App supports native reloading.
     */
    reload_supported?: boolean;
  } | undefined>;
  /**
   * Notifies parent iframe about the current iframe is going to reload.
   * @see https://docs.telegram-mini-apps.com/platform/methods#iframe-will-reload
   */
  iframe_will_reload: CreateParams;
  /**
   * Emitted by bot mini apps to ask the client to initialize the biometric authentication manager
   * object for the current bot, emitting a `biometry_info_received` event on completion.
   *
   * This request should just initialize the client-side state, i.e. by checking if biometric
   * authentication is even available or not, it should not ask the user anything.
   * @since v7.2
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-biometry-get-info
   */
  web_app_biometry_get_info: CreateParams;
  /**
   * Opens the biometric access settings for bots. Useful when you need to request biometrics
   * access to users who haven't granted it yet.
   *
   * _Note that this method can be called only in response to user interaction with the Mini
   * App interface (e.g. a click inside the Mini App or on the main button)_.
   * @since v7.2
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-biometry-open-settings
   */
  web_app_biometry_open_settings: CreateParams;
  /**
   * Emitted by bot mini apps to ask the user permission to use biometric authentication,
   * emitting a `biometry_info_received` event on completion.
   *
   * This request should not actually prompt biometric authentication, it should just ask the
   * user permission to use them, and a popup should be shown only if the user hasn't already
   * allowed or denied the usage of biometric authentication for the bot associated with the
   * mini app.
   * @since v7.2
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-biometry-request-access
   */
  web_app_biometry_request_access: CreateParams<{
    /**
     * Reason to request biometry access. Should be at least 1 symbol length, but not
     * more than 128 symbols.
     */
    reason?: string;
  }>;
  /**
   * Attempts to authenticate a user using biometrics and fetch a previously stored
   * secure token, emitting the `biometry_auth_requested` event on completion, containing either
   * an error, or a decrypted biometric token (or an empty string if no token was configured yet).
   *
   * Should only be used if the `token_saved` field of the `biometry_info_received` event object
   * is equal to true.
   *
   * If a user has previously disallowed the bot from using biometric authentication, this
   * request will immediately fail, emitting an appropriate `biometry_auth_requested` event.
   * @since v7.2
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-biometry-request-auth
   */
  web_app_biometry_request_auth: CreateParams<{
    /**
     * Reason to request biometry data. Should be at least 1 symbol length, but not more than
     * 128 symbols.
     */
    reason?: string;
  }>;
  /**
   * Attempts to authenticate using biometrics and store the biometric token
   * securely on a device, emitting a `biometry_token_updated` event on completion.
   *
   * This token will be safely stored by the Telegram client and will be associated with the bot
   * that owns the mini app.
   *
   * If the user has previously disallowed the bot from using biometric authentication, this
   * request will immediately fail, emitting an appropriate biometry_token_updated event.
   * @since v7.2
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-biometry-update-token
   */
  web_app_biometry_update_token: CreateParams<{
    /**
     * Optional string field, containing the reason why the bot is asking to authenticate using biometrics (1-128 chars, used in the prompt).
     */
    reason?: string;
    /**
     * The new token (string, 0-1024 chars), or an empty string to remove it.
     */
    token: string;
  }>;
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
   * Closes a QR scanner. The Telegram application creates `scan_qr_popup_closed` event.
   * @since v6.4
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-close-scan-qr-popup
   */
  web_app_close_scan_qr_popup: CreateParams;
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
   * Invokes custom method.
   * @since v6.9
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-invoke-custom-method
   */
  web_app_invoke_custom_method: CreateParams<AnyInvokeCustomMethodParams>;
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
   * Opens a new popup. When user closes the popup, Telegram creates the `popup_closed` event.
   * @since v6.2
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-open-popup
   */
  web_app_open_popup: CreateParams<PopupParams>;
  /**
   * Opens a QR scanner. When the scanner was closed, the Telegram application creates
   * the `scan_qr_popup_closed` event. When the scanner reads QR, Telegram creates the
   * `qr_text_received` event.
   * @since v6.4
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-open-scan-qr-popup
   */
  web_app_open_scan_qr_popup: CreateParams<{
    /**
     * Text to be displayed in the QR scanner.
     */
    text?: string;
  }>;
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
   * Reads text from the clipboard. The method accepts a request identifier which is used to
   * appropriately retrieve the method execution result from the `clipboard_text_received` event.
   * @since v6.4
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-read-text-from-clipboard
   */
  web_app_read_text_from_clipboard: CreateParams<{
    /**
     * Unique request identifier. Should be any unique string to handle the generated event
     * appropriately.
     */
    req_id: string;
  }>;
  /**
   * Notifies Telegram about current application is ready to be shown. This method will make
   * Telegram to remove application loader and display Mini App.
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-ready
   */
  web_app_ready: CreateParams;
  /**
   * Requests access to current user's phone.
   * @since v6.9
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-request-phone
   */
  web_app_request_phone: CreateParams;
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
   * Requests write message access to current user.
   * @since v6.9
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-rqeuest-write-access
   */
  web_app_request_write_access: CreateParams;
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
  /**
   * Updates current state of Settings Button.
   * @since v6.10
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-setup-settings-button
   */
  web_app_setup_settings_button: CreateParams<{
    /**
     * Should the Settings Button be displayed.
     */
    is_visible: boolean;
  }>;
  /**
   * Changes swipe behavior.
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-setup-swipe-behavior
   * @since v7.7
   */
  web_app_setup_swipe_behavior: CreateParams<{
    allow_vertical_swipe: boolean;
  }>;
  /**
   * Inserts the bot's username and the specified inline query in the current chat's input field.
   * Query may be empty, in which case only the bot's username will be inserted. The client prompts
   * the user to choose a specific chat, then opens that chat and inserts the bot's username and
   * the specified inline query in the input field.
   * @since v6.7
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-switch-inline-query
   */
  web_app_switch_inline_query: CreateParams<{
    /**
     * Text which should be inserted in the input after the current bot name. Max length is
     * 256 symbols.
     */
    query: string;
    /**
     * List of chat types which could be chosen to send the message. Could be empty list.
     */
    chat_types: SwitchInlineQueryChatType[];
  }>;
  /**
   * Generates haptic feedback event.
   * @since v6.1
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-trigger-haptic-feedback
   */
  web_app_trigger_haptic_feedback: CreateParams<AnyHapticFeedbackParams>;
}

/**
 * Mini Apps method name.
 */
export type MethodName = keyof Methods;

/**
 * Parameters of the specified Mini Apps method.
 */
export type MethodParams<M extends MethodName> = Methods[M]['params'];

/**
 * Methods with optional parameters.
 */
export type MethodNameWithOptionalParams = {
  [M in MethodName]: undefined extends MethodParams<M>
    ? M
    : never;
}[MethodName];

/**
 * Methods without parameters.
 */
export type MethodNameWithoutParams = {
  [M in MethodName]: If<IsNever<MethodParams<M>>, M, never>;
}[MethodName];

/**
 * Methods with parameters.
 */
export type MethodNameWithRequiredParams = Exclude<
  MethodName,
  MethodNameWithoutParams | MethodNameWithOptionalParams
>;

/**
 * Method names which have versioned params.
 */
export type MethodNameWithVersionedParams = {
  [M in MethodName]: If<IsNever<Methods[M]['versionedParams']>, never, M>;
}[MethodName];

/**
 * Method parameters which appear only in the specific Telegram Mini Apps version.
 */
export type MethodVersionedParams<M extends MethodNameWithVersionedParams> =
  Methods[M]['versionedParams'];
