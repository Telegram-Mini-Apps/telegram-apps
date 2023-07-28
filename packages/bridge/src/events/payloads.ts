import type { RGB } from '@twa.js/utils';

export interface ClipboardTextReceivedPayload {
  req_id: string;
  data?: string | null;
}

export type InvoiceStatus =
  | 'paid'
  | 'failed'
  | 'pending'
  | 'cancelled'
  | string;

export interface InvoiceClosedPayload {
  slug: string;
  status: InvoiceStatus;
}

export interface QrTextReceivedPayload {
  data?: string;
}

export interface ThemeChangedPayload {
  theme_params: {
    bg_color?: RGB;
    text_color?: RGB;
    hint_color?: RGB;
    link_color?: RGB;
    button_color?: RGB;
    button_text_color?: RGB;
    secondary_bg_color?: RGB;
  };
}

export interface ViewportChangedPayload {
  height: number;
  width: number;
  is_expanded: boolean;
  is_state_stable: boolean;
}

export interface PopupClosedPayload {
  button_id?: string;
}
