import {
  number,
  string,
  boolean,
  json,
  rgb,
} from '@tma.js/parsing';

import type {
  ClipboardTextReceivedPayload, CustomMethodInvokedPayload,
  InvoiceClosedPayload, PhoneRequestedPayload,
  PopupClosedPayload, QrTextReceivedPayload,
  ThemeChangedPayload,
  ViewportChangedPayload, WriteAccessRequestedPayload,
} from './payloads.js';

function isNullOrUndefined(value: unknown): boolean {
  return value === null || value === undefined;
}

/**
 * Parses incoming value as ThemeChangedPayload.
 */
export const themeChangedPayload = json<ThemeChangedPayload>({
  theme_params: json<ThemeChangedPayload['theme_params']>({
    bg_color: rgb().optional(),
    text_color: rgb().optional(),
    hint_color: rgb().optional(),
    link_color: rgb().optional(),
    button_color: rgb().optional(),
    button_text_color: rgb().optional(),
    secondary_bg_color: rgb().optional(),
  }),
});

/**
 * Parses incoming value as ViewportChangedPayload.
 * @param value - value to parse.
 */
export const viewportChangedPayload = json<ViewportChangedPayload>({
  height: number(),
  width: number().optional(isNullOrUndefined).default(() => window.innerWidth),
  is_state_stable: boolean(),
  is_expanded: boolean(),
});

/**
 * Parses incoming value as PopupClosedPayload.
 */
export const popupClosedPayload = json<PopupClosedPayload>({
  button_id: string().optional(isNullOrUndefined),
});

/**
 * Parses incoming value as QrTextReceivedPayload.
 */
export const qrTextReceivedPayload = json<QrTextReceivedPayload>({
  data: string().optional(),
});

/**
 * Parses incoming value as InvoiceClosedPayload.
 */
export const invoiceClosedPayload = json<InvoiceClosedPayload>({
  slug: string(),
  status: string(),
});

/**
 * Parses incoming value as clipboard text received payload.
 */
export const clipboardTextReceivedPayload = json<ClipboardTextReceivedPayload>({
  req_id: string(),
  data: (value) => (value === null ? value : string().optional().parse(value)),
});

/**
 * Parses incoming value as WriteAccessRequestedPayload.
 */
export const writeAccessRequestedPayload = json<WriteAccessRequestedPayload>({ status: string() });

/**
 * Parses incoming value as PhoneRequestedPayload.
 */
export const phoneRequestedPayload = json<PhoneRequestedPayload>({ status: string() });

/**
 * Parses incoming value as CustomMethodInvokedPayload.
 */
export const customMethodInvokedPayload = json<CustomMethodInvokedPayload>({
  req_id: string(),
  result: (value) => value,
  error: string().optional(),
});
