import { request } from '@/bridge/utils/request.js';
import { WithStateAndSupports } from '@/classes/with-state-and-supports/WithStateAndSupports.js';
import type { InvoiceStatus } from '@/bridge/events/types.js';
import type { PostEvent } from '@/bridge/methods/postEvent.js';
import type { Version } from '@/version/types.js';

import type { InvoiceState } from './types.js';

// TODO: Usage.

/**
 * @see API: https://docs.telegram-mini-apps.com/packages/tma-js-sdk/components/invoice
 */
export class Invoice extends WithStateAndSupports<InvoiceState, 'open'> {
  constructor(
    isOpened: boolean,
    version: Version,
    private readonly postEvent: PostEvent,
  ) {
    super({ isOpened }, version, { open: 'web_app_open_invoice' });
  }

  private set isOpened(value) {
    this.set('isOpened', value);
  }

  /**
   * True if invoice is currently opened.
   */
  get isOpened(): boolean {
    return this.get('isOpened');
  }

  /**
   * Opens an invoice using its slug.
   * @param slug - invoice slug.
   * @throws {Error} Invoice is already opened.
   */
  open(slug: string): Promise<InvoiceStatus>;

  /**
   * Opens an invoice using its url. It expects passing link in full format, with hostname "t.me".
   * @param url - invoice URL.
   * @param type - value type.
   * @throws {Error} Invoice is already opened.
   */
  open(url: string, type: 'url'): Promise<InvoiceStatus>;

  async open(urlOrSlug: string, type?: 'url'): Promise<InvoiceStatus> {
    if (this.isOpened) {
      throw new Error('Invoice is already opened');
    }

    let slug: string;
    if (!type) {
      slug = urlOrSlug;
    } else {
      const { hostname, pathname } = new URL(urlOrSlug, window.location.href);
      if (hostname !== 't.me') {
        throw new Error(`Incorrect hostname: ${hostname}`);
      }

      // Valid examples:
      // "/invoice/my-slug"
      // "/$my-slug"
      const match = pathname.match(/^\/(\$|invoice\/)([A-Za-z0-9\-_=]+)$/);
      if (!match) {
        // eslint-disable-next-line no-template-curly-in-string
        throw new Error('Link pathname has incorrect format. Expected to receive "/invoice/{slug}" or "/${slug}"');
      }
      [, , slug] = match;
    }

    this.isOpened = true;

    try {
      const result = await request({
        method: 'web_app_open_invoice',
        event: 'invoice_closed',
        params: { slug },
        postEvent: this.postEvent,
        capture(data) {
          return slug === data.slug;
        },
      });

      return result.status;
    } finally {
      this.isOpened = false;
    }
  }
}
