import { createHmac } from './hmac.js';

/**
 * Signs specified data with the passed token.
 * @param data - data to sign.
 * @param token - bot token.
 * @returns Data sign.
 */
export async function signData(data: string, token: string): Promise<string> {
  const tokenHmac = await createHmac(token, 'WebAppData')
  const dataHmac = await createHmac(data, tokenHmac);

  const hexDigest = (
    Array.prototype.map.call(new Uint8Array(dataHmac), (byte: number) =>
      byte.toString(16).padStart(2, "0")
    ) as number[]
  ).join("");

  return hexDigest
}
