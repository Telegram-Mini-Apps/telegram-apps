import {
  TypedError,
  type ExecuteWithOptions,
  type InvoiceStatus,
  type ExecuteWithPostEvent,
} from '@telegram-apps/bridge';
import { signal } from '@telegram-apps/signals';

import { request } from '@/scopes/globals.js';
import { ERR_INVALID_HOSTNAME, ERR_INVALID_SLUG, ERR_ALREADY_CALLED } from '@/errors.js';
import { withIsSupported } from '@/scopes/toolkit/withIsSupported.js';
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';

const WEB_APP_OPEN_INVOICE = 'web_app_open_invoice';

/**
 * True if the invoice is currently opened.
 */
export const isOpened = signal(false);

/**
 * @returns True if the Invoice is supported.
 */
export const isSupported = createIsSupported(WEB_APP_OPEN_INVOICE);

/**
 * Opens an invoice using its slug.
 * Example of the value: `jd231xxSd1`
 * @param slug - invoice slug.
 * @param options - additional options.
 * @throws {TypedError} ERR_ALREADY_CALLED
 * @throws {TypedError} ERR_INVALID_HOSTNAME
 * @throws {TypedError} ERR_INVALID_SLUG
 */
export function _open(slug: string, options?: ExecuteWithPostEvent): Promise<InvoiceStatus>;

/**
 * Opens an invoice using its url.
 *
 * The function expects to pass a link in a full format, with the hostname "t.me".
 * Examples:
 * - `https://t.me/$jd231xxSd1`
 * - `https://t.me/invoice/jd231xxSd1`
 * @param url - invoice URL.
 * @param type - value type.
 * @param options - additional options.
 * @throws {TypedError} ERR_ALREADY_CALLED
 * @throws {TypedError} ERR_INVALID_HOSTNAME
 * @throws {TypedError} ERR_INVALID_SLUG
 */
export function _open(
  url: string,
  type: 'url',
  options?: ExecuteWithPostEvent,
): Promise<InvoiceStatus>;

export async function _open(
  urlOrSlug: string,
  optionsOrType?: 'url' | ExecuteWithOptions,
  options?: ExecuteWithOptions,
): Promise<InvoiceStatus> {
  if (isOpened()) {
    throw new TypedError(ERR_ALREADY_CALLED);
  }

  let slug: string;

  if (optionsOrType === 'url') {
    const { hostname, pathname } = new URL(urlOrSlug, window.location.href);
    if (hostname !== 't.me') {
      throw new TypedError(ERR_INVALID_HOSTNAME);
    }

    // Valid examples:
    // "/invoice/my-slug"
    // "/$my-slug"
    const match = pathname.match(/^\/(\$|invoice\/)([A-Za-z0-9\-_=]+)$/);
    if (!match) {
      throw new TypedError(ERR_INVALID_SLUG);
    }
    [, , slug] = match;
  } else {
    slug = urlOrSlug;
    options = optionsOrType;
  }

  isOpened.set(true);

  return request(WEB_APP_OPEN_INVOICE, 'invoice_closed', {
    ...options,
    params: { slug },
    capture: (data) => slug === data.slug,
  })
    .then(r => r.status)
    .finally(() => {
      isOpened.set(false);
    });
}

/**
 * @throws {TypedError} ERR_NOT_SUPPORTED
 */
export const open = withIsSupported(_open, isSupported);
