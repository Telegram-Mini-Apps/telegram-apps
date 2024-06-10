import { createHmac } from 'node:crypto';

/**
 * Signs specified data with the passed token.
 * @param data - data to sign.
 * @param token - bot token.
 * @returns Data sign.
 */
export function signData(data: string, token: string): string {
  return createHmac(
    'sha256',
    createHmac('sha256', 'WebAppData').update(token).digest(),
  )
    .update(data)
    .digest()
    .toString('hex');
}