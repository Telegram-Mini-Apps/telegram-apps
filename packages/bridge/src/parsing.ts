import {
  createJsonStructParser, isRecord,
  JsonParser, parseJsonParamAsBool,
  parseJsonParamAsNum, parseJsonParamAsOptNum,
  parseJsonParamAsRecord, parseJsonParamAsString,
} from 'twa-core';
import {
  InvoiceClosedPayload,
  PopupClosedPayload,
  ThemeChangedPayload,
  ViewportChangedPayload,
} from './events';

/**
 * Raw `viewport_changed` event payload.
 */
interface ViewportChangedRawPayload {
  height: number;
  width: number | null;
  is_expanded: boolean;
  is_state_stable: boolean;
}

/**
 * Parses incoming JSON value as popup button id.
 * @param value - raw value.
 */
const parseJsonParamAsPopupButtonId: JsonParser<string | null> = value => {
  return value === null || value === undefined
    ? null
    : parseJsonParamAsString(value);
};

/**
 * Parses incoming JSON value as ViewportChangedPayload.
 */
const parseJsonParamAsViewportChangedRawPayload =
  createJsonStructParser<ViewportChangedRawPayload>({
    height: ['height', parseJsonParamAsNum],
    width: ['width', parseJsonParamAsOptNum],
    is_state_stable: ['is_state_stable', parseJsonParamAsBool],
    is_expanded: ['is_expanded', parseJsonParamAsBool],
  });

/**
 * Parses incoming value as ThemeChangedPayload.
 */
export const extractThemeChangedPayload = createJsonStructParser<ThemeChangedPayload>({
  theme_params: ['theme_params', parseJsonParamAsRecord],
});

/**
 * Parses incoming value as ViewportChangedPayload.
 */
export function extractViewportChangedPayload(data: unknown): ViewportChangedPayload {
  // Firstly, try to parse event payload as its web version.
  const {width, ...rest} = parseJsonParamAsViewportChangedRawPayload(data);

  // Desktop and mobile versions of Telegram are not sending width property.
  // TODO: Issue
  return {...rest, width: width === null ? window.innerWidth : width};
}

/**
 * Parses incoming value as PopupClosedPayload.
 */
export const extractPopupClosedPayload = createJsonStructParser<PopupClosedPayload>({
  button_id: ['button_id', parseJsonParamAsPopupButtonId],
});

/**
 * Parses incoming value as InvoiceClosedPayload.
 */
export const extractInvoiceClosedPayload = createJsonStructParser<InvoiceClosedPayload>({
  slug: ['slug', parseJsonParamAsString],
  status: ['status', parseJsonParamAsString],
});

/**
 * Extracts event data from native application event.
 */
export const extractMessageEventData = createJsonStructParser<{ type: string, data: unknown }>({
  type: ['eventType', parseJsonParamAsString],
  data: ['eventData', value => value],
});