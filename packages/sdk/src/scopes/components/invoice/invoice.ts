import {
  TypedError,
  type ExecuteWithOptions,
  type InvoiceStatus,
  type ExecuteWithPostEvent,
} from '@telegram-apps/bridge';
import { signal } from '@telegram-apps/signals';

import { request } from '@/scopes/globals.js';
import {
  ERR_INVALID_HOSTNAME,
  ERR_INVALID_SLUG,
  ERR_ALREADY_CALLED,
} from '@/errors.js';
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';
import {
  createWrapSafeSupported
} from '@/scopes/toolkit/createWrapSafeSupported.js';

const WEB_APP_OPEN_INVOICE = 'web_app_open_invoice';

/**
 * True if an invoice is currently opened.
 */
export const isOpened = signal(false);

/**
 * @returns True if the Invoice component is supported.
 */
export const isSupported = createIsSupported(WEB_APP_OPEN_INVOICE);

const wrapSafe = createWrapSafeSupported('invoice', WEB_APP_OPEN_INVOICE);

/**
 * Opens an invoice using its slug.
 * @param slug - invoice slug.
 * @param options - additional options.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @throws {TypedError} ERR_ALREADY_CALLED
 * @example
 * if (open.isAvailable()) {
 *   const status = await open('gkljs@@n1mdf');
 * }
 */
export function _open(slug: string, options?: ExecuteWithPostEvent): Promise<InvoiceStatus>;

/**
 * Opens an invoice using its url.
 * @param url - invoice URL.
 * @param type - value type.
 * @param options - additional options.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @throws {TypedError} ERR_ALREADY_CALLED
 * @throws {TypedError} ERR_INVALID_HOSTNAME
 * @throws {TypedError} ERR_INVALID_SLUG
 * @example
 * if (open.isAvailable()) {
 *   const status = await open('https://t.me/$gkljs@@n1mdf', 'url');
 * }
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

export const open = wrapSafe('open', _open);
