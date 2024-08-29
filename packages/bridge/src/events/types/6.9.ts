export type PhoneRequestedStatus = 'sent' | 'cancelled' | string;

export type WriteAccessRequestedStatus = 'allowed' | string;

export interface Events69 {
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