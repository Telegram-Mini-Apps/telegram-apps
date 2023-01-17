import {Version, compareVersions} from '@twa.js/utils';
import {BridgeEventListener, InvoiceStatus, supports} from '@twa.js/bridge';

import {Platform} from './types';
import {createSupportsFunc, formatURL, SupportsFunc} from '../../utils';
import {BridgeLike} from '../../types';

/**
 * Provides common Web Apps functionality not covered by other system
 * components.
 */
class WebApp {
  constructor(
    private readonly bridge: BridgeLike,
    version: Version,
    private readonly _platform: Platform,
  ) {
    this.supports = createSupportsFunc(version, {
      openInvoice: 'web_app_open_invoice',
      readTextFromClipboard: 'web_app_read_text_from_clipboard',
    });
    this.version = version;
  }

  /**
   * Closes Web App.
   */
  close(): void {
    this.bridge.postEvent('web_app_close');
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
    url = formatURL(url);

    // If method is supported by current version, open link via bridge event.
    if (supports('web_app_open_link', this.version)) {
      return this.bridge.postEvent('web_app_open_link', {url});
    }
    // Otherwise, do it in legacy way.
    window.open(url, '_blank');
  }

  /**
   * Opens a Telegram link inside Telegram app. The Web App will be closed.
   * It expects passing link in full format, with hostname "t.me".
   * @param url - URL to be opened.
   * @throws {Error} URL has not allowed hostname.
   */
  openTelegramLink(url: string): void {
    const {hostname, pathname, search} = new URL(formatURL(url));

    // We allow opening links with the only 1 hostname.
    if (hostname !== 't.me') {
      throw new Error(
        `URL has not allowed hostname: ${hostname}. Only "t.me" is allowed`,
      );
    }

    // If method is supported by current version, open link via bridge event.
    if (supports('web_app_open_tg_link', this.version)) {
      return this.bridge.postEvent('web_app_open_tg_link', {
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
    const {hostname, pathname} = new URL(formatURL(url));

    if (hostname !== 't.me') {
      throw new Error('Incorrect hostname: ' + hostname);
    }
    // Valid examples:
    // "/invoice/my-slug"
    // "/$my-slug"
    const match = pathname.match(/^\/(\$|invoice\/)([A-Za-z0-9\-_=]+)$/);

    if (match === null) {
      throw new Error('Link pathname has incorrect format. Expected to receive "/invoice/slug" or "/$slug"');
    }
    // Open invoice.
    this.bridge.postEvent('web_app_open_invoice', {slug: match[2]});

    return new Promise(res => {
      // Create event listener which will resolve invoice status.
      const listener: BridgeEventListener<'invoice_closed'> = a => {
        // Remove bound listener.
        this.bridge.off('invoice_closed', listener);

        // Resolve value.
        res(a.status);
      };
      // Add event listener to catch invoice status.
      this.bridge.on('invoice_closed', listener);
    });
  }

  /**
   * Returns current Web App platform.
   */
  get platform(): Platform {
    return this._platform;
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
    this.bridge.postEvent('web_app_ready');
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
    for (let i = 0; i < 32; i++) {
      reqId += Math.ceil(Math.random() * 10).toString();
    }

    return new Promise<string | null>(res => {
      const listener: BridgeEventListener<'clipboard_text_received'> = payload => {
        if (payload.req_id === reqId) {
          res(payload.data === undefined ? null : payload.data);
          this.bridge.off('clipboard_text_received', listener);
        }
      };
      this.bridge.on('clipboard_text_received', listener);
      this.bridge.postEvent('web_app_read_text_from_clipboard', {req_id: reqId});
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
    const size = new Blob([data]).size;
    if (size === 0 || size > 4096) {
      throw new Error(`Passed data has incorrect size: ${size}`);
    }
    this.bridge.postEvent('web_app_data_send', {data});
  }

  /**
   * Returns true in case, specified method is supported by current WebApp.
   */
  supports: SupportsFunc<'openInvoice' | 'readTextFromClipboard'>;

  /**
   * Current Web App version. This property is used by other components to check if
   * some functionality is available on current device.
   */
  version: Version;
}

export {WebApp};