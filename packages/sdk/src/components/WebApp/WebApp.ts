import {
  compareVersions,
  EventEmitter,
  type Version,
  type RGB,
} from '@twa.js/utils';
import {
  on, postEvent as bridgePostEvent,
  supports,
  type HeaderColorKey,
  type InvoiceStatus,
  type PostEvent,
} from '@twa.js/bridge';

import { formatURL, isColorDark } from '../../utils/index.js';
import { WithSupports } from '../../lib/index.js';

import type { ColorScheme, Platform } from '../../types.js';
import type { WebAppEvents } from './events.js';

/**
 * Provides common Web Apps functionality not covered by other system
 * components.
 */
export class WebApp
  extends WithSupports<'openInvoice' | 'readTextFromClipboard' | 'setHeaderColor' | 'setBackgroundColor'> {
  readonly #ee = new EventEmitter<WebAppEvents>();

  readonly #platform: Platform;

  readonly #postEvent: PostEvent;

  readonly #version: Version;

  #backgroundColor: RGB;

  #headerColor: HeaderColorKey;

  constructor(
    version: Version,
    platform: Platform,
    headerColor: HeaderColorKey,
    backgroundColor: RGB,
    postEvent: PostEvent = bridgePostEvent,
  ) {
    super(version, {
      openInvoice: 'web_app_open_invoice',
      readTextFromClipboard: 'web_app_read_text_from_clipboard',
      setHeaderColor: 'web_app_set_header_color',
      setBackgroundColor: 'web_app_set_background_color',
    });
    this.#postEvent = postEvent;
    this.#platform = platform;
    this.#version = version;
    this.#headerColor = headerColor;
    this.#backgroundColor = backgroundColor;
  }

  /**
   * Returns current application background color.
   */
  get backgroundColor(): RGB {
    return this.#backgroundColor;
  }

  /**
   * Returns current application color scheme. This value is
   * computed based on the current background color.
   */
  get colorScheme(): ColorScheme {
    return isColorDark(this.backgroundColor) ? 'dark' : 'light';
  }

  /**
   * Closes the Web App.
   */
  close(): void {
    this.#postEvent('web_app_close');
  }

  /**
   * Returns current application header color key.
   */
  get headerColor(): HeaderColorKey {
    return this.#headerColor;
  }

  /**
   * Returns true if passed version is more than or equal to current
   * Web App version.
   * @param version - compared version.
   */
  isVersionAtLeast(version: Version): boolean {
    return compareVersions(version, this.version) >= 0;
  }

  /**
   * Opens a link in an external browser. The Web App will not be closed.
   *
   * Note that this method can be called only in response to the user
   * interaction with the Web App interface (e.g. click inside the Web App
   * or on the main button).
   * @param url - URL to be opened.
   */
  openLink(url: string): void {
    const formattedUrl = formatURL(url);

    // If method is supported by current version, open link via bridge event.
    if (supports('web_app_open_link', this.version)) {
      return this.#postEvent('web_app_open_link', { url: formattedUrl });
    }
    // Otherwise, do it in legacy way.
    window.open(formattedUrl, '_blank');
  }

  /**
   * Opens a Telegram link inside Telegram app. The Web App will be closed.
   * It expects passing link in full format, with hostname "t.me".
   * @param url - URL to be opened.
   * @throws {Error} URL has not allowed hostname.
   */
  openTelegramLink(url: string): void {
    const { hostname, pathname, search } = new URL(formatURL(url));

    // We allow opening links with the only 1 hostname.
    if (hostname !== 't.me') {
      throw new Error(
        `URL has not allowed hostname: ${hostname}. Only "t.me" is allowed`,
      );
    }

    // If method is supported by current version, open link via bridge event.
    if (supports('web_app_open_tg_link', this.version)) {
      return this.#postEvent('web_app_open_tg_link', {
        path_full: pathname + search,
      });
    }
    // Otherwise, do it in legacy way.
    window.location.href = url;
  }

  /**
   * Opens an invoice using its url. It expects passing link in full format,
   * with hostname "t.me".
   * @param url - invoice URL.
   */
  openInvoice(url: string): Promise<InvoiceStatus> {
    // TODO: Allow opening with slug.
    const { hostname, pathname } = new URL(formatURL(url));

    if (hostname !== 't.me') {
      throw new Error(`Incorrect hostname: ${hostname}`);
    }
    // Valid examples:
    // "/invoice/my-slug"
    // "/$my-slug"
    const match = pathname.match(/^\/(\$|invoice\/)([A-Za-z0-9\-_=]+)$/);

    if (match === null) {
      throw new Error('Link pathname has incorrect format. Expected to receive "/invoice/slug" or "/$slug"');
    }
    const [, , slug] = match;

    // Open invoice.
    this.#postEvent('web_app_open_invoice', { slug });

    return new Promise((res) => {
      // Add event listener to catch invoice status.
      const off = on('invoice_closed', ({ status, slug: eventSlug }) => {
        // Ignore other invoices.
        if (slug !== eventSlug) {
          return;
        }

        // Remove event listener and resolve status.
        off();
        res(status);
      });
    });
  }

  /**
   * Adds new event listener.
   */
  on = this.#ee.on.bind(this.#ee);

  /**
   * Removes event listener.
   */
  off = this.#ee.off.bind(this.#ee);

  /**
   * Returns current Web App platform.
   */
  get platform(): Platform {
    return this.#platform;
  }

  /**
   * Informs the Telegram app that the Web App is ready to be displayed.
   *
   * It is recommended to call this method as early as possible, as soon as
   * all essential interface elements loaded. Once this method called,
   * the loading placeholder is hidden and the Web App shown.
   *
   * If the method not called, the placeholder will be hidden only when
   * the page fully loaded.
   */
  ready(): void {
    this.#postEvent('web_app_ready');
  }

  /**
   * Reads text from clipboard and returns string or null. null is returned
   * in cases:
   * - Value in clipboard is not text
   * - Access to clipboard is not allowed
   */
  readTextFromClipboard(): Promise<string | null> {
    // Generate request identifier.
    let reqId = '';
    for (let i = 0; i < 32; i += 1) {
      reqId += Math.ceil(Math.random() * 10).toString();
    }

    return new Promise<string | null>((res) => {
      const off = on('clipboard_text_received', ({ req_id, data }) => {
        if (req_id === reqId) {
          res(data === undefined ? null : data);
          off();
        }
      });

      this.#postEvent('web_app_read_text_from_clipboard', { req_id: reqId });
    });
  }

  /**
   * A method used to send data to the bot. When this method called, a
   * service message sent to the bot containing the data of the
   * length up to 4096 bytes, and the Web App closed. See the field
   * `web_app_data` in the class Message.
   *
   * This method is only available for Web Apps launched via a Keyboard button.
   * @param data - data to send to bot.
   * @throws {Error} data has incorrect size.
   */
  sendData(data: string): void {
    // Firstly, compute passed text size in bytes.
    const { size } = new Blob([data]);
    if (size === 0 || size > 4096) {
      throw new Error(`Passed data has incorrect size: ${size}`);
    }
    this.#postEvent('web_app_data_send', { data });
  }

  /**
   * Updates current application header color.
   * FIXME: Has no effect on desktop, works incorrectly on Android.
   *  Issues:
   *  https://github.com/Telegram-Web-Apps/twa.js/issues/9
   *  https://github.com/Telegram-Web-Apps/twa.js/issues/8
   * @param color - settable color key.
   */
  setHeaderColor(color: HeaderColorKey) {
    this.#postEvent('web_app_set_header_color', { color_key: color });

    if (this.#headerColor === color) {
      return;
    }

    this.#headerColor = color;
    this.#ee.emit('headerColorChanged', color);
  }

  /**
   * Updates current application background color.
   * FIXME: Has no effect on desktop, works incorrectly in Android.
   *  Issues:
   *  https://github.com/Telegram-Web-Apps/twa.js/issues/9
   *  https://github.com/Telegram-Web-Apps/twa.js/issues/8
   * @param color - new color.
   */
  setBackgroundColor(color: RGB) {
    this.#postEvent('web_app_set_background_color', { color });

    if (this.#backgroundColor === color) {
      return;
    }

    this.#backgroundColor = color;
    this.#ee.emit('backgroundColorChanged', color);
  }

  /**
   * Current Web App version. This property is used by other components to check if
   * some functionality is available on current device.
   */
  get version(): Version {
    return this.#version;
  }
}
