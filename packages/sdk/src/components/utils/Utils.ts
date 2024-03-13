import type { PostEvent } from '../../bridge/methods/postEvent.js';
import { postEvent as defaultPostEvent } from '../../bridge/methods/postEvent.js';
import { request } from '../../bridge/request.js';
import { createSupportsFunc } from '../../supports/createSupportsFunc.js';
import { createSupportsParamFunc } from '../../supports/createSupportsParamFunc.js';
import { supports } from '../../supports/supports.js';
import type { SupportsFunc } from '../../supports/types.js';
import type { CreateRequestIdFunc } from '../../types/request-id.js';
import type { Version } from '../../version/types.js';

/**
 * Provides common Mini Apps functionality not covered by other system components.
 */
export class Utils {
  constructor(
    private readonly version: Version,
    private readonly createRequestId: CreateRequestIdFunc,
    private readonly postEvent: PostEvent = defaultPostEvent,
  ) {
    this.supports = createSupportsFunc(version, {
      readTextFromClipboard: 'web_app_read_text_from_clipboard',
    });

    this.supportsParam = createSupportsParamFunc(version, {
      'openLink.tryInstantView': ['web_app_open_link', 'try_instant_view'],
    });
  }

  /**
   * Opens a link in an external browser. The Mini App will not be closed.
   *
   * Note that this method can be called only in response to the user
   * interaction with the Mini App interface (e.g. click inside the Mini App
   * or on the main button).
   * @param url - URL to be opened.
   * @param tryInstantView
   */
  openLink(url: string, tryInstantView?: boolean): void {
    const formattedUrl = new URL(url, window.location.href).toString();

    // If method is not supported, we are doing it in legacy way.
    if (!supports('web_app_open_link', this.version)) {
      window.open(formattedUrl, '_blank');
      return;
    }

    // Otherwise, do it normally.
    this.postEvent('web_app_open_link', {
      url: formattedUrl,
      ...(typeof tryInstantView === 'boolean' ? { try_instant_view: tryInstantView } : {}),
    });
  }

  /**
   * Opens a Telegram link inside Telegram app. The Mini App will be closed. It expects passing
   * link in full format, with hostname "t.me".
   * @param url - URL to be opened.
   * @throws {Error} URL has not allowed hostname.
   */
  openTelegramLink(url: string): void {
    const {
      hostname,
      pathname,
      search,
    } = new URL(url, window.location.href);

    if (hostname !== 't.me') {
      throw new Error(`URL has not allowed hostname: ${hostname}. Only "t.me" is allowed`);
    }

    if (!supports('web_app_open_tg_link', this.version)) {
      window.location.href = url;
      return;
    }

    this.postEvent('web_app_open_tg_link', { path_full: pathname + search });
  }

  /**
   * Reads text from clipboard and returns string or null. null is returned
   * in cases:
   * - Value in clipboard is not text
   * - Access to clipboard is not allowed
   */
  readTextFromClipboard(): Promise<string | null> {
    return request(
      'web_app_read_text_from_clipboard',
      { req_id: this.createRequestId() },
      'clipboard_text_received',
      { postEvent: this.postEvent },
    ).then(({ data = null }) => data);
  }

  /**
   * Checks if specified method is supported by current component.
   */
  supports: SupportsFunc<'readTextFromClipboard'>;

  /**
   * Checks if specified method parameter is supported by current component.
   */
  supportsParam: SupportsFunc<'openLink.tryInstantView'>;
}
