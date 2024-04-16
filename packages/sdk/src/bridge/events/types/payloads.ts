import type { RGB } from '@/colors/types.js';
import type { RequestId } from '@/request-id/types.js';

export interface ClipboardTextReceivedPayload {
  /**
   * Passed during the `web_app_read_text_from_clipboard` method invocation `req_id` value.
   */
  req_id: RequestId;
  /**
   * Data extracted from the clipboard. The returned value will have the type `string` only in
   * the case, application has access to the clipboard.
   */
  data?: string | null;
}

export interface CustomMethodInvokedPayload<R = unknown> {
  /**
   * Unique identifier of this invocation.
   */
  req_id: RequestId;
  /**
   * Method invocation successful result.
   */
  result?: R;
  /**
   * Method invocation error code.
   */
  error?: string;
}

export type InvoiceStatus =
  | 'paid'
  | 'failed'
  | 'pending'
  | 'cancelled'
  | string;

export interface InvoiceClosedPayload {
  /**
   * Passed during the `web_app_open_invoice` method invocation `slug` value.
   */
  slug: string;
  /**
   * Invoice status
   */
  status: InvoiceStatus;
}

export type PhoneRequestedStatus = 'sent' | 'cancelled' | string;

export interface PhoneRequestedPayload {
  /**
   * Request status.
   */
  status: PhoneRequestedStatus;
}

export interface PopupClosedPayload {
  /**
   * Identifier of the clicked button. In case, the popup was closed without clicking any button,
   * this property will be omitted.
   */
  button_id?: string;
}

export interface QrTextReceivedPayload {
  /**
   * Data extracted from the QR.
   */
  data?: string;
}

export interface ThemeChangedPayload {
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
}

export interface ViewportChangedPayload {
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
}

export type WriteAccessRequestedStatus = 'allowed' | string;

export interface WriteAccessRequestedPayload {
  /**
   * Request status.
   */
  status: WriteAccessRequestedStatus;
}
