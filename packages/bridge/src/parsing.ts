import {
  createJsonParser,
  parseJsonValueAsNumber,
  parseJsonValueAsString,
} from '@twa.js/utils';
import {ViewportChangedPayload} from './listening';

/**
 * Parses incoming value as ThemeChangedPayload.
 */
export const parseThemeChangedPayload = createJsonParser({
  theme_params: createJsonParser({
    bg_color: 'rgb',
    text_color: 'rgb',
    hint_color: 'rgb',
    link_color: 'rgb',
    button_color: 'rgb',
    button_text_color: 'rgb',
    secondary_bg_color: {type: 'rgb', optional: true},
  }),
});

/**
 * Parses incoming value as ViewportChangedPayload with optional width.
 */
const parseRawViewportChangedPayload = createJsonParser({
  height: 'number',
  width: {
    type: value => value === null ? undefined : parseJsonValueAsNumber(value),
    optional: true,
  },
  is_state_stable: 'boolean',
  is_expanded: 'boolean',
});

/**
 * Parses incoming value as ViewportChangedPayload.
 * @param value - value to parse.
 */
export function parseViewportChangedPayload(value: unknown): ViewportChangedPayload {
  const {
    width = window.innerWidth,
    ...rest
  } = parseRawViewportChangedPayload(value);
  return {width, ...rest};
}

/**
 * Parses incoming value as PopupClosedPayload.
 */
export const parsePopupClosedPayload = createJsonParser({
  button_id: {
    type: value => value === null ? undefined : parseJsonValueAsString(value),
    optional: true,
  },
});

/**
 * Parses incoming value as QrTextReceivedPayload.
 */
export const parseQrTextReceivedPayload = createJsonParser({
  data: {type: 'string', optional: true},
});

/**
 * Parses incoming value as InvoiceClosedPayload.
 */
export const parseInvoiceClosedPayload = createJsonParser({
  slug: 'string',
  status: 'string',
});

/**
 * Parses incoming value as clipboard text received payload.
 */
export const parseClipboardTextReceivedPayload = createJsonParser({
  req_id: 'string',
  data: {
    type: value => value === null ? value : parseJsonValueAsString(value),
    optional: true,
  },
});
