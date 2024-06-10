import { createHmac } from './createHmac.js';

/**
 * Signs specified data with the passed token.
 * @param data - data to sign.
 * @param token - bot token.
 * @returns Data sign.
 */
export async function signData(data: string, token: string): Promise<string> {
  return (
    Array.prototype.map.call(
      new Uint8Array(await createHmac(data, await createHmac(token, 'WebAppData'))),
      (byte: number) => byte.toString(16).padStart(2, '0'),
    ) as number[]
  ).join('');
}
