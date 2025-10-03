import { computed, type Computed, signal } from '@tma.js/signals';
import { type InvoiceStatus } from '@tma.js/bridge';
import { BetterPromise } from 'better-promises';

import { createWrapSafe, type SafeWrapped } from '@/wrappers/wrapSafe.js';
import { createIsSupportedSignal } from '@/helpers/createIsSupportedSignal.js';
import type { RequestOptionsNoCapture } from '@/types.js';
import { ConcurrentCallError, InvalidArgumentsError } from '@/errors.js';
import { teToPromise } from '@/helpers/teToPromise.js';
import type { WithVersion } from '@/fn-options/withVersion.js';
import type { WithRequest } from '@/fn-options/withRequest.js';
import type { SharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';

export interface InvoiceOptions extends WithVersion, WithRequest, SharedFeatureOptions {
}

/**
 * @since Mini Apps v6.1
 */
export class Invoice {
  constructor({ version, request, isTma }: InvoiceOptions) {
    const wrapSupported = createWrapSafe({
      version,
      isTma,
      isSupported: 'web_app_open_invoice',
    });

    const openPromise = signal<BetterPromise<InvoiceStatus>>();

    this.isSupported = createIsSupportedSignal('web_app_open_invoice', version);
    this.isOpened = computed(() => !!openPromise);
    this.open = wrapSupported((
      urlOrSlug: string,
      optionsOrType?: 'url' | RequestOptionsNoCapture,
      options?: RequestOptionsNoCapture,
    ): BetterPromise<InvoiceStatus> => {
      if (this.isOpened()) {
        // TODO: Make some changes in better-promises.
        return BetterPromise.resolve('').then(() => {
          throw new ConcurrentCallError('Invoice is already opened');
        });
      }

      let slug: string;
      if (optionsOrType === 'url') {
        const { hostname, pathname } = new URL(urlOrSlug, window.location.href);
        if (hostname !== 't.me') {
          // TODO: Make some changes in better-promises.
          return BetterPromise.resolve('').then(() => {
            throw new InvalidArgumentsError(`Link has unexpected hostname: ${hostname}`);
          });
        }

        // Valid examples:
        // "/invoice/my-slug"
        // "/$my-slug"
        const match = pathname.match(/^\/(\$|invoice\/)([A-Za-z0-9\-_=]+)$/);
        if (!match) {
          return BetterPromise.resolve('').then(() => {
            throw new InvalidArgumentsError(
              'Expected to receive a link with a pathname in format "/invoice/{slug}" or "/${slug}"',
            );
          });
        }
        [, , slug] = match;
      } else {
        slug = urlOrSlug;
        options = optionsOrType;
      }

      const promise = teToPromise(
        request('web_app_open_invoice', 'invoice_closed', {
          ...options,
          params: { slug },
          capture: data => slug === data.slug,
        }),
      )
        .then(response => response.status)
        .finally(() => {
          openPromise.set(undefined);
        });

      openPromise.set(promise);

      return promise;
    });
  }

  /**
   * Signal indicating if invoice is currently opened.
   */
  readonly isOpened: Computed<boolean>;

  /**
   * Signal indicating if the component is supported.
   */
  readonly isSupported: Computed<boolean>;

  /**
   * Opens an invoice using its slug or URL.
   * @param slug - invoice slug.
   * @param options - additional options.
   * @since Mini Apps v6.1
   * @example Using slug
   * const status = await open('kJNFS331');
   * @example Using URL
   * const status = await open('https://t.me/$kJNFS331', 'url');
   * @example Using another URL
   * const status = await open('https://t.me/invoice/kJNFS331', 'url');
   */
  open: SafeWrapped<{
    (slug: string, options?: RequestOptionsNoCapture): BetterPromise<InvoiceStatus>;
    (url: string, type: 'url', options?: RequestOptionsNoCapture): BetterPromise<InvoiceStatus>;
  }, true>;
}
