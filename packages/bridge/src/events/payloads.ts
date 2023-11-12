import type { RGB } from '@tma.js/colors';

import type { RequestId } from '../shared.js';

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

export interface QrTextReceivedPayload {
  /**
   * Data extracted from the QR.
   */
  data?: string;
}

export type ThemeParamsKey =
  | 'accent_text_color'
  | 'bg_color'
  | 'button_color'
  | 'button_text_color'
  | 'destructive_text_color'
  | 'header_bg_color'
  | 'hint_color'
  | 'link_color'
  | 'secondary_bg_color'
  | 'section_header_text_color'
  | 'section_bg_color'
  | 'subtitle_text_color'
  | 'text_color';

export interface ThemeChangedPayload {
  /**
   * Map where the key is a theme stylesheet key and value is  the corresponding color in
   * `#RRGGBB` format.
   */
  theme_params: {
    [Key in ThemeParamsKey]?: RGB;
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

export interface PopupClosedPayload {
  /**
   * Identifier of the clicked button. In case, the popup was closed without clicking any button,
   * this property will be omitted.
   */
  button_id?: string;
}

export type PhoneRequestedStatus = 'sent' | string;

export interface PhoneRequestedPayload {
  /**
   * Request status.
   */
  status: PhoneRequestedStatus;
}

export type WriteAccessRequestedStatus = 'allowed' | string;

export interface WriteAccessRequestedPayload {
  /**
   * Request status.
   */
  status: WriteAccessRequestedStatus;
}
