import { number, string, json } from '@twa.js/utils';

import type { ViewportChangedPayload } from './payloads.js';

/**
 * Parses incoming value as ThemeChangedPayload.
 */
export const themeChangedPayload = json({
  theme_params: json({
    bg_color: 'rgb',
    text_color: 'rgb',
    hint_color: 'rgb',
    link_color: 'rgb',
    button_color: 'rgb',
    button_text_color: 'rgb',
    secondary_bg_color: { type: 'rgb', optional: true },
  }),
});

/**
 * Parses incoming value as ViewportChangedPayload with optional width.
 */
const rawViewportChangedPayload = json({
  height: 'number',
  width: {
    type: (value) => (value === null ? undefined : number(value)),
    optional: true,
  },
  is_state_stable: 'boolean',
  is_expanded: 'boolean',
});

/**
 * Parses incoming value as ViewportChangedPayload.
 * @param value - value to parse.
 */
export function viewportChangedPayload(value: unknown): ViewportChangedPayload {
  const {
    width = window.innerWidth,
    ...rest
  } = rawViewportChangedPayload(value);
  return { width, ...rest };
}

/**
 * Parses incoming value as PopupClosedPayload.
 */
export const popupClosedPayload = json({
  button_id: {
    type: (value) => (value === null ? undefined : string(value)),
    optional: true,
  },
});

/**
 * Parses incoming value as QrTextReceivedPayload.
 */
export const qrTextReceivedPayload = json({
  data: { type: 'string', optional: true },
});

/**
 * Parses incoming value as InvoiceClosedPayload.
 */
export const invoiceClosedPayload = json({
  slug: 'string',
  status: 'string',
});

/**
 * Parses incoming value as clipboard text received payload.
 */
export const clipboardTextReceivedPayload = json({
  req_id: 'string',
  data: {
    type: (value) => (value === null ? value : string(value)),
    optional: true,
  },
});
