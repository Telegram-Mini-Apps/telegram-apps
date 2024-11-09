import {
  TypedError,
  type InvoiceStatus,
  type ExecuteWithPostEvent,
} from '@telegram-apps/bridge';
import { signal } from '@telegram-apps/signals';

import { request } from '@/scopes/globals.js';
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';
import { createWrapSupported } from '@/scopes/toolkit/createWrapSupported.js';
import {
  ERR_INVALID_URL,
  ERR_INVALID_SLUG,
  ERR_ALREADY_OPENED,
} from '@/errors.js';

const OPEN_METHOD = 'web_app_open_invoice';
const wrapSupported = createWrapSupported('invoice', OPEN_METHOD);

/**
 * Signal indicating if an invoice is opened.
 */
export const isOpened = signal(false);

/**
 * Signal indicating if invoices are supported.
 */
export const isSupported = createIsSupported(OPEN_METHOD);

/**
 * Opens an invoice using its slug.
 * @param slug - invoice slug.
 * @param options - additional options.
 * @since Mini Apps v6.1
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_ALREADY_OPENED
 * @example
 * if (open.isAvailable()) {
 *   const status = await open('kJNFS331');
 * }
 */
export function _open(
  slug: string,
  options?: ExecuteWithPostEvent,
): Promise<InvoiceStatus>;

/**
 * Opens an invoice using its url.
 * @param url - invoice URL.
 * @param type - value type.
 * @param options - additional options.
 * @since Mini Apps v6.1
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_ALREADY_OPENED
 * @throws {TypedError} ERR_INVALID_URL
 * @throws {TypedError} ERR_INVALID_SLUG
 * @example
 * if (open.isAvailable()) {
 *   const status = await open('https://t.me/$kJNFS331', 'url');
 * }
 * @example
 * if (open.isAvailable()) {
 *   const status = await open('https://t.me/invoice/kJNFS331', 'url');
 * }
 */
export function _open(
  url: string,
  type: 'url',
  options?: ExecuteWithPostEvent,
): Promise<InvoiceStatus>;

export async function _open(
  urlOrSlug: string,
  optionsOrType?: 'url' | ExecuteWithPostEvent,
  options?: ExecuteWithPostEvent,
): Promise<InvoiceStatus> {
  if (isOpened()) {
    throw new TypedError(ERR_ALREADY_OPENED, 'An invoice is already opened');
  }

  let slug: string;

  if (optionsOrType === 'url') {
    const { hostname, pathname } = new URL(urlOrSlug, window.location.href);
    if (hostname !== 't.me') {
      throw new TypedError(ERR_INVALID_URL, `Link has unexpected hostname: ${hostname}`);
    }

    // Valid examples:
    // "/invoice/my-slug"
    // "/$my-slug"
    const match = pathname.match(/^\/(\$|invoice\/)([A-Za-z0-9\-_=]+)$/);
    if (!match) {
      throw new TypedError(
        ERR_INVALID_SLUG,
        `Expected to receive a link with a pathname in format "/invoice/{slug}" or "/\${slug}"`,
      );
    }
    [, , slug] = match;
  } else {
    // todo: validate slug?
    slug = urlOrSlug;
    options = optionsOrType;
  }

  isOpened.set(true);

  return request(OPEN_METHOD, 'invoice_closed', {
    ...options,
    params: { slug },
    capture: (data) => slug === data.slug,
  })
    .then(r => r.status)
    .finally(() => {
      isOpened.set(false);
    });
}

export const open = wrapSupported('open', _open);
