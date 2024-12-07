import { hashToken } from './hashToken.js';
import { arrayBufferToHex } from './converters/arrayBufferToHex.js';
import { hexToArrayBuffer } from './converters/hexToArrayBuffer.js';
import type { CreateHmacFn, SharedOptions, Text } from './types.js';

export type SignDataOptions = SharedOptions;

/**
 * Signs specified data with the passed token.
 * @param data - data to sign.
 * @param key - private key.
 * @param createHmac - function to create HMAC-SHA256.
 * @param options - additional method options.
 * @returns Data sign.
 */
export function signData(
  data: Text,
  key: Text,
  createHmac: CreateHmacFn<false>,
  options?: SignDataOptions,
): string;

/**
 * Signs specified data with the passed token.
 * @param data - data to sign.
 * @param key - private key.
 * @param createHmac - function to create HMAC-SHA256.
 * @param options - additional method options.
 * @returns Data sign.
 */
export function signData(
  data: Text,
  key: Text,
  createHmac: CreateHmacFn<true>,
  options?: SignDataOptions,
): Promise<string>;

export function signData(
  data: Text,
  key: Text,
  createHmac: CreateHmacFn<boolean>,
  options: SignDataOptions = {},
): string | Promise<string> {
  const keyHmac = options.tokenHashed
    ? typeof key === 'string'
      // If a hashed token was passed, we assume that it is a HEX string. Not to mess with
      // the createHmac function, we should convert this HEX string to ArrayBuffer. Otherwise,
      // incorrect behavior will be met.
      ? hexToArrayBuffer(key)
      : key
    : hashToken(key, createHmac);

  if (keyHmac instanceof Promise) {
    return keyHmac.then(v => createHmac(data, v)).then(arrayBufferToHex);
  }

  const hmac = createHmac(data, keyHmac);
  return hmac instanceof Promise ? hmac.then(arrayBufferToHex) : arrayBufferToHex(hmac);
}
