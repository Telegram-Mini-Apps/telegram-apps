import { hashToken } from './hashToken.js';
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
  const keyHmac = options.tokenHashed ? key : hashToken(key, createHmac);
  if (keyHmac instanceof Promise) {
    return keyHmac
      .then(v => createHmac(data, v))
      .then(v => v.toString('hex'));
  }

  const hmac = createHmac(data, typeof keyHmac === 'string'
    ? Buffer.from(keyHmac, 'hex')
    : keyHmac);
  return hmac instanceof Promise
    ? hmac.then(v => v.toString('hex'))
    : hmac.toString('hex');
}
