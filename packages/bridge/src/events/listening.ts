import {EventName, EventListener, RGB} from '@twa.js/utils';

interface ClipboardTextReceivedPayload {
  req_id: string;
  data?: string | null;
}

type InvoiceStatus =
  | 'paid'
  | 'failed'
  | 'pending'
  | 'cancelled'
  | string;

/**
 * @see https://corefork.telegram.org/api/bots/webapps#invoice-closed
 */
interface InvoiceClosedPayload {
  slug: string;
  status: InvoiceStatus;
}

interface QrTextReceivedPayload {
  data?: string;
}

/**
 * @see https://corefork.telegram.org/api/bots/webapps#theme-changed
 */
interface ThemeChangedPayload {
  theme_params: {
    bg_color: RGB;
    text_color: RGB;
    hint_color: RGB;
    link_color: RGB;
    button_color: RGB;
    button_text_color: RGB;
    secondary_bg_color?: RGB;
  };
}

/**
 * @see https://corefork.telegram.org/api/bots/webapps#viewport-changed
 */
interface ViewportChangedPayload {
  height: number;
  width: number;
  is_expanded: boolean;
  is_state_stable: boolean;
}

interface PopupClosedPayload {
  button_id?: string;
}

/**
 * Map where key is known event name, and value is its listener.
 */
interface BridgeEventsMap {
  /**
   * User clicked back button.
   * @since Web App version 6.1+
   */
  back_button_pressed(): void;

  /**
   * Invoice was closed.
   * @param payload - invoice close information.
   */
  invoice_closed(payload: InvoiceClosedPayload): void;

  /**
   * User clicked main button.
   */
  main_button_pressed(): void;

  /**
   * Popup was closed.
   * @param payload - popup close information.
   */
  popup_closed(payload: PopupClosedPayload): void;

  /**
   * Telegram requested to update current application style.
   * @param html - `style` tag inner HTML.
   */
  set_custom_style(html: string): void;

  /**
   * Occurs when the Settings item in context menu is pressed.
   * @since Web App version 6.1+
   */
  settings_button_pressed(): void;

  /**
   * Occurs whenever theme settings are changed in the user's Telegram app
   * (including switching to night mode).
   * @param payload - theme information.
   */
  theme_changed(payload: ThemeChangedPayload): void;

  /**
   * Viewport was changed.
   * @param payload - viewport information.
   */
  viewport_changed(payload: ViewportChangedPayload): void;

  /**
   * Data from QR was extracted.
   * @since Web App version 6.4+
   */
  qr_text_received(payload: QrTextReceivedPayload): void;

  /**
   * QR scanner was closed.
   * @since Web App version 6.4+
   */
  scan_qr_popup_closed(): void;

  /**
   * Text was extracted from clipboard.
   * @since Web App version 6.4+
   * @param payload - event information
   */
  clipboard_text_received(payload: ClipboardTextReceivedPayload): void;
}

/**
 * Bridge event name which could be listened.
 */
type BridgeEventName = EventName<BridgeEventsMap>;

/**
 * Returns listener for specified event name.
 */
type BridgeEventListener<E extends BridgeEventName> =
  EventListener<BridgeEventsMap[E]>;

export {
  BridgeEventListener,
  BridgeEventsMap,
  PopupClosedPayload,
  InvoiceClosedPayload,
  BridgeEventName,
  InvoiceStatus,
  ThemeChangedPayload,
  ViewportChangedPayload,
  ClipboardTextReceivedPayload,
  QrTextReceivedPayload,
};
