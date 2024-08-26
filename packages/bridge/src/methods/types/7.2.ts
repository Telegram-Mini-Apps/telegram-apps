import type { CreateParams } from './utils.js';

export interface Methods72 {
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
}