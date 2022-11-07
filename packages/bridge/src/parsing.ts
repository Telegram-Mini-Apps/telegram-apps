import {
  createJsonStructParser, isRecord,
  JsonParser, parseJsonParamAsBool,
  parseJsonParamAsNum,
  parseJsonParamAsRecord, parseJsonParamAsString,
} from 'twa-core';
import {
  InvoiceClosedPayload,
  PopupClosedPayload,
  ThemeChangedPayload,
  ViewportChangedPayload,
} from './events';

/**
 * `viewport_changed` event payload on web version of Telegram. To be removed,
 * when issue is closed.
 * Issue: https://github.com/Telegram-Web-Apps/client-sdk/issues/12
 */
interface WebViewportChangedPayload {
  height: number;
  width: number;
  is_expanded: boolean;
}

/**
 * `viewport_changed` event payload on non-web version of Telegram.
 */
interface NonWebViewportChangedPayload {
  height: number;
  is_expanded: boolean;
  is_state_stable: boolean;
}

/**
 * Parses incoming JSON value as popup button id.
 * @param value - raw value.
 */
const parseJsonParamAsPopupButtonId: JsonParser<string | null> = value => {
  return value === null || value === undefined
  // TODO: Record is sent in web version of Telegram.
  //  Issue: https://github.com/Telegram-Web-Apps/client-sdk/issues/4
  || isRecord(value)
    ? null
    : parseJsonParamAsString(value);
};

/**
 * Parses incoming JSON value as ViewportChangedPayload.
 */
const parseJsonParamAsNonWebViewportChangedPayload =
  createJsonStructParser<NonWebViewportChangedPayload>({
    height: ['height', parseJsonParamAsNum],
    is_state_stable: ['is_state_stable', parseJsonParamAsBool],
    is_expanded: ['is_expanded', parseJsonParamAsBool],
  });

/**
 * Parses incoming JSON value as ViewportChangedPayload.
 */
const parseJsonParamAsWebViewportChangedPayload =
  createJsonStructParser<WebViewportChangedPayload>({
    height: ['height', parseJsonParamAsNum],
    width: ['width', parseJsonParamAsNum],
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
  try {
    // Firstly, try to parse event payload as its web version.
    const payload = parseJsonParamAsWebViewportChangedPayload(data);

    // Property is_state_stable is not sent on Web version of Telegram. We
    // pass it by ourselves to follow consistency between platforms.
    return {...payload, is_state_stable: true};
  } catch (e) {
    // Otherwise, try to parse it as it is presented in desktop and mobile
    // versions.
    const payload = parseJsonParamAsNonWebViewportChangedPayload(data);

    // As long as non web version of Telegram is not sending width property,
    // we pass it by ourselves to follow consistency between platforms.
    return {...payload, width: window.innerWidth};
  }
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