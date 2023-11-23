import {
  postEvent as defaultPostEvent,
  request,
} from '~/bridge/index.js';
import { EventEmitter } from '~/event-emitter/index.js';
import { State } from '~/state/index.js';
import {
  createSupportsFunc,
  type SupportsFunc,
} from '~/supports/index.js';
import type { InvoiceStatus, PostEvent } from '~/bridge/index.js';
import type { InvoiceEvents, InvoiceState } from '~/invoice/types.js';
import type { Version } from '~/version/index.js';

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
  on = this.ee.on.bind(this.ee);

  /**
   * Removes event listener.
   */
  off = this.ee.off.bind(this.ee);

  /**
   * Opens an invoice using its url. It expects passing link in full format,
   * with hostname "t.me".
   * @param url - invoice URL.
   */
  open(url: string): Promise<InvoiceStatus> {
    if (this.isOpened) {
      throw new Error('Invoice is already opened');
    }

    // TODO: Allow opening with slug.
    const { hostname, pathname } = new URL(url, window.location.href);
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

    this.isOpened = true;

    return request('web_app_open_invoice', { slug }, 'invoice_closed', {
      postEvent: this.postEvent,
      capture: ({ slug: eventSlug }) => slug === eventSlug,
    })
      .then((data) => data.status)
      .finally(() => {
        this.isOpened = false;
      });
  }

  /**
   * Checks if specified method is supported by current component.
   */
  supports: SupportsFunc<'open'>;
}
