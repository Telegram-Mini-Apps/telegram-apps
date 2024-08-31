import { request, type InvoiceStatus } from '@telegram-apps/bridge';
import { computed } from '@telegram-apps/signals';
import { AsyncOptions, BetterPromise } from '@telegram-apps/toolkit';

import { decorateWithIsSupported, type WithIsSupported } from '@/scopes/decorateWithIsSupported.js';
import { $postEvent } from '@/scopes/globals/globals.js';
import { ERR_INVALID_HOSTNAME, ERR_INVALID_SLUG, ERR_INVOICE_OPENED } from '@/errors/errors.js';
import { SDKError } from '@/errors/SDKError.js';

import * as _ from './private.js';

/*
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/invoice
 * todo usage
 */

type OpenFn = WithIsSupported<{
  /**
   * Opens an invoice using its slug.
   * @param slug - invoice slug.
   * @param options - additional options.
   * @throws {SDKError} ERR_INVOICE_OPENED
   * @throws {SDKError} ERR_INVALID_HOSTNAME
   * @throws {SDKError} ERR_INVALID_SLUG
   * @see ERR_INVOICE_OPENED
   * @see ERR_INVALID_HOSTNAME
   * @see ERR_INVALID_SLUG
   */
  (slug: string, options?: AsyncOptions): BetterPromise<InvoiceStatus>;
  /**
   * Opens an invoice using its url. It expects to pass a link in full format, with hostname "t.me".
   * @param url - invoice URL.
   * @param type - value type.
   * @param options - additional options.
   * @throws {SDKError} ERR_INVOICE_OPENED
   * @throws {SDKError} ERR_INVALID_HOSTNAME
   * @throws {SDKError} ERR_INVALID_SLUG
   * @see ERR_INVOICE_OPENED
   * @see ERR_INVALID_HOSTNAME
   * @see ERR_INVALID_SLUG
   */
  (url: string, type: 'url', options?: AsyncOptions): BetterPromise<InvoiceStatus>;
}>;

const MINI_APPS_METHOD = 'web_app_open_invoice';

/**
 * True if the invoice is currently opened.
 */
export const isOpened = computed(_.$isOpened);

export const open: OpenFn = decorateWithIsSupported(
  (urlOrSlug, optionsOrType?, options?) => {
    return BetterPromise.withFn(() => {
      if (_.$isOpened()) {
        throw new SDKError(ERR_INVOICE_OPENED);
      }

      let slug: string;

      if (optionsOrType === 'url') {
        const { hostname, pathname } = new URL(urlOrSlug, window.location.href);
        if (hostname !== 't.me') {
          throw new SDKError(ERR_INVALID_HOSTNAME);
        }

        // Valid examples:
        // "/invoice/my-slug"
        // "/$my-slug"
        const match = pathname.match(/^\/(\$|invoice\/)([A-Za-z0-9\-_=]+)$/);
        if (!match) {
          throw new SDKError(ERR_INVALID_SLUG);
        }
        [, , slug] = match;
      } else {
        slug = urlOrSlug;
        options = optionsOrType;
      }

      _.$isOpened.set(true);

      return request(MINI_APPS_METHOD, 'invoice_closed', {
        ...options || {},
        params: { slug },
        postEvent: $postEvent(),
        capture(data) {
          return slug === data.slug;
        },
      })
        .then(r => r.status)
        .finally(() => {
          _.$isOpened.set(false);
        });
    });
  },
  MINI_APPS_METHOD,
);
