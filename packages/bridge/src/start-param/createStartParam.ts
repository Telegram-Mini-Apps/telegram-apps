import { encodeBase64Url } from '@/base64-url/encodeBase64Url.js';

/**
 * Creates a safe start parameter value.
 * @param value - value to create start parameter from.
 * @throws {Error} If the value length is too big for the allowed one.
 * @see Learn more about start parameter:
 * https://docs.telegram-mini-apps.com/platform/start-parameter
 */
export function createStartParam(value: string): string {
  const b64 = encodeBase64Url(value);
  if (b64.length > 512) {
    throw new Error('Value is too long for start parameter');
  }
  return b64;
}