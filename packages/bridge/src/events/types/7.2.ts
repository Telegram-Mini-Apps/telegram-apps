export type BiometryType = 'finger' | 'face' | string;

export type BiometryTokenUpdateStatus = 'updated' | 'removed' | 'failed' | string;

export type BiometryAuthRequestStatus = 'failed' | 'authorized' | string;

export interface Events72 {
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
}