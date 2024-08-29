export interface Events64 {
  /**
   * Telegram application attempted to extract text from clipboard.
   * @since v6.4
   * @see https://docs.telegram-mini-apps.com/platform/events#clipboard-text-received
   */
  clipboard_text_received: {
    /**
     * Passed during the `web_app_read_text_from_clipboard` method invocation `req_id` value.
     */
    req_id: string;
    /**
     * Data extracted from the clipboard. The returned value will have the type `string` only in
     * the case, application has access to the clipboard.
     */
    data?: string | null;
  };
  /**
   * The QR scanner scanned some QR and extracted its content.
   * @param payload - event payload.
   * @since v6.4
   * @see https://docs.telegram-mini-apps.com/platform/events#qr-text-received
   */
  qr_text_received: {
    /**
     * Data extracted from the QR.
     */
    data: string;
  };
  /**
   * QR scanner was closed.
   * @since v6.4
   * @see https://docs.telegram-mini-apps.com/platform/events#scan-qr-popup-closed
   */
  scan_qr_popup_closed: never;
}