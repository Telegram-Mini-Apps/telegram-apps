import { initDataToSearchParams } from './initDataToSearchParams.js';

import { signDataNode, signDataWeb } from './signData.js';
import type { SignData, SignDataAsyncFn, SignDataSyncFn } from './types.js';

/**
 * Signs specified init data.
 * @param data - init data to sign.
 * @param authDate - date, when this init data should be signed.
 * @param key - private key.
 * @param signData - function signing data.
 * @returns Signed init data presented as query parameters.
 */
function sign(data: SignData, key: string, authDate: Date, signData: SignDataSyncFn): string;

/**
 * Signs specified init data.
 * @param data - init data to sign.
 * @param authDate - date, when this init data should be signed.
 * @param key - private key.
 * @param signData - function signing data.
 * @returns Signed init data presented as query parameters.
 */
function sign(
  data: SignData,
  key: string,
  authDate: Date,
  signData: SignDataAsyncFn,
): Promise<string>;

function sign(
  data: SignData,
  key: string,
  authDate: Date,
  signData: SignDataSyncFn | SignDataAsyncFn,
): string | Promise<string> {
  // Create search parameters, which will be signed further.
  const sp = initDataToSearchParams({
    ...data,
    authDate,
  });

  // Convert search params to pairs and sort the final array.
  const pairs = [...sp.entries()]
    .map(([name, value]) => `${name}=${value}`)
    .sort();

  // Compute sign, append it to the params and return.
  function processSign(s: string): string {
    sp.append('hash', s);
    return sp.toString();
  }

  const sign = signData(pairs.join('\n'), key);
  return typeof sign === 'string' ? processSign(sign) : sign.then(processSign);
}

/**
 * Signs specified init data.
 * @param data - init data to sign.
 * @param authDate - date, when this init data should be signed.
 * @param key - private key.
 * @returns Signed init data presented as query parameters.
 */
export function signNode(data: SignData, key: string, authDate: Date): string {
  return sign(data, key, authDate, signDataNode);
}

/**
 * Signs specified init data.
 * @param data - init data to sign.
 * @param authDate - date, when this init data should be signed.
 * @param key - private key.
 * @returns Signed init data presented as query parameters.
 */
export function signWeb(data: SignData, key: string, authDate: Date): Promise<string> {
  return sign(data, key, authDate, signDataWeb);
}
