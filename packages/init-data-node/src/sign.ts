import { serializeInitDataQuery } from '@telegram-apps/transformers';

import type { SharedOptions, SignData, SignDataAsyncFn, SignDataSyncFn, Text } from './types.js';

export type SignOptions = SharedOptions;

/**
 * Signs specified init data.
 * @param data - init data to sign.
 * @param authDate - date, when this init data should be signed.
 * @param key - private key.
 * @param signData - function signing data.
 * @param options - additional options.
 * @returns Signed init data presented as query parameters.
 */
export function sign(
  data: SignData,
  key: Text,
  authDate: Date,
  signData: SignDataSyncFn,
  options?: SignOptions,
): string;

/**
 * Signs specified init data.
 * @param data - init data to sign.
 * @param authDate - date, when this init data should be signed.
 * @param key - private key.
 * @param signData - function signing data.
 * @param options - additional options.
 * @returns Signed init data presented as query parameters.
 */
export function sign(
  data: SignData,
  key: Text,
  authDate: Date,
  signData: SignDataAsyncFn,
  options?: SignOptions,
): Promise<string>;

export function sign(
  data: SignData,
  key: Text,
  authDate: Date,
  signData: SignDataSyncFn | SignDataAsyncFn,
  options?: SignOptions,
): string | Promise<string> {
  // Create search parameters, which will be signed further.
  const searchParams = new URLSearchParams(
    serializeInitDataQuery({
      ...data,
      auth_date: authDate,
      hash: '',
      signature: data.signature || '',
    }),
  );
  searchParams.delete('hash');

  // Convert search params to pairs and sort the final array.
  const pairs = [...searchParams.entries()]
    .map(([name, value]) => `${name}=${value}`)
    .sort();

  // Compute sign, append it to the params and return.
  function processSign(s: string): string {
    searchParams.append('hash', s);
    return searchParams.toString();
  }

  const sign = signData(pairs.join('\n'), key, options);
  return typeof sign === 'string' ? processSign(sign) : sign.then(processSign);
}
