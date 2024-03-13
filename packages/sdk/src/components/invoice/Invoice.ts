import type { InvoiceEvents, InvoiceState } from './types.js';
import type { InvoiceStatus } from '../../bridge/events/parsers/invoiceClosed.js';
import type { PostEvent } from '../../bridge/methods/postEvent.js';
import { postEvent as defaultPostEvent } from '../../bridge/methods/postEvent.js';
import { request } from '../../bridge/request.js';
import { EventEmitter } from '../../event-emitter/EventEmitter.js';
import { State } from '../../state/State.js';
import { createSupportsFunc } from '../../supports/createSupportsFunc.js';
import type { SupportsFunc } from '../../supports/types.js';
import type { Version } from '../../version/types.js';

type Emitter = EventEmitter<InvoiceEvents>;

/**
 * Extracts invoice slug from URL.
 * @param url - url to extract slug from.
 */
function slugFromUrl(url: string): string {
  const { hostname, pathname } = new URL(url, window.location.href);
  if (hostname !== 't.me') {
    throw new Error(`Incorrect hostname: ${hostname}`);
  }

  // Valid examples:
  // "/invoice/my-slug"
  // "/$my-slug"
  const match = pathname.match(/^\/(\$|invoice\/)([A-Za-z0-9\-_=]+)$/);

  if (match === null) {
    // eslint-disable-next-line no-template-curly-in-string
    throw new Error('Link pathname has incorrect format. Expected to receive "/invoice/{slug}" or "/${slug}"');
  }
  return match[2];
}

/**
 * Controls currently displayed invoice.
 */
export class Invoice {
  private readonly ee = new EventEmitter<InvoiceEvents>();

  private readonly state: State<InvoiceState>;

  constructor(
    version: Version,
    private readonly postEvent: PostEvent = defaultPostEvent,
  ) {
    this.state = new State({ isOpened: false }, this.ee);
    this.supports = createSupportsFunc(version, { open: 'web_app_open_invoice' });
  }

  private set isOpened(value) {
    this.state.set('isOpened', value);
  }

  /**
   * True if invoice is currently opened.
   */
  get isOpened(): boolean {
    return this.state.get('isOpened');
  }

  /**
   * Adds new event listener.
   */
  on: Emitter['on'] = this.ee.on.bind(this.ee);

  /**
   * Removes event listener.
   */
  off: Emitter['off'] = this.ee.off.bind(this.ee);

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

    const slug = type ? slugFromUrl(urlOrSlug) : urlOrSlug;

    this.isOpened = true;

    try {
      const result = await request(
        'web_app_open_invoice',
        { slug },
        'invoice_closed',
        {
          postEvent: this.postEvent,
          capture(data) {
            return slug === data.slug;
          },
        },
      );

      return result.status;
    } finally {
      this.isOpened = false;
    }
  }

  /**
   * Checks if specified method is supported by current component.
   */
  supports: SupportsFunc<'open'>;
}
