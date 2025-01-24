import type { InvoiceStatus } from '@telegram-apps/bridge';
import type { CancelablePromise } from 'better-promises';

import { request } from '@/globals.js';
import { createWrapSupported } from '@/scopes/wrappers/createWrapSupported.js';
import { InvalidArgumentsError } from '@/errors.js';
import { defineNonConcurrentFn } from '@/scopes/defineNonConcurrentFn.js';
import { createIsSupported } from '@/scopes/createIsSupported.js';
import type { RequestOptionsNoCapture } from '@/types.js';

const METHOD_NAME = 'web_app_open_invoice';
const wrapSupported = createWrapSupported('invoice', METHOD_NAME);

/**
 * Signal indicating if invoices are supported.
 */
export const isSupported = createIsSupported(METHOD_NAME);

/**
 * Opens an invoice using its slug.
 * @param slug - invoice slug.
 * @param options - additional options.
 * @since Mini Apps v6.1
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @throws {InvalidArgumentsError} An invoice is already opened
 * @example
 * if (open.isAvailable()) {
 *   const status = await open('kJNFS331');
 * }
 */
function _open(slug: string, options?: RequestOptionsNoCapture): CancelablePromise<InvoiceStatus>;

/**
 * Opens an invoice using its url.
 * @param url - invoice URL.
 * @param type - value type.
 * @param options - additional options.
 * @since Mini Apps v6.1
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @throws {InvalidArgumentsError} An invoice is already opened
 * @throws {InvalidArgumentsError} Link has unexpected hostname
 * @example
 * if (open.isAvailable()) {
 *   const status = await open('https://t.me/$kJNFS331', 'url');
 * }
 * @example
 * if (open.isAvailable()) {
 *   const status = await open('https://t.me/invoice/kJNFS331', 'url');
 * }
 */
function _open(url: string, type: 'url', options?: RequestOptionsNoCapture): CancelablePromise<InvoiceStatus>;

function _open(
  urlOrSlug: string,
  optionsOrType?: 'url' | RequestOptionsNoCapture,
  options?: RequestOptionsNoCapture,
): CancelablePromise<InvoiceStatus> {
  let slug: string;
  if (optionsOrType === 'url') {
    const { hostname, pathname } = new URL(urlOrSlug, window.location.href);
    if (hostname !== 't.me') {
      throw new InvalidArgumentsError(`Link has unexpected hostname: ${hostname}`);
    }

    // Valid examples:
    // "/invoice/my-slug"
    // "/$my-slug"
    const match = pathname.match(/^\/(\$|invoice\/)([A-Za-z0-9\-_=]+)$/);
    if (!match) {
      throw new InvalidArgumentsError(
        `Expected to receive a link with a pathname in format "/invoice/{slug}" or "/\${slug}"`,
      );
    }
    [, , slug] = match;
  } else {
    // todo: validate slug?
    slug = urlOrSlug;
    options = optionsOrType;
  }

  return request(METHOD_NAME, 'invoice_closed', {
    ...options,
    params: { slug },
    capture: (data) => slug === data.slug,
  })
    .then(d => d.status);
}

const [
  fn,
  tOpenPromise,
  tOpenError,
] = defineNonConcurrentFn(_open, 'Invoice is already opened');

export const open = wrapSupported('open', fn);
export const [, openPromise, isOpened] = tOpenPromise;
export const [, openError] = tOpenError;
