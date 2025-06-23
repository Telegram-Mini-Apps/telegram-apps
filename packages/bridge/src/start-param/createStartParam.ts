import { encodeBase64Url } from '@/base64-url/encodeBase64Url.js';

/**
 * Creates a safe start parameter value. If the value is not a string, the function applies
 * JSON.stringify to it, so make sure you are not passing an object with circular references.
 *
 * @param value - value to create start parameter from.
 * @throws {Error} If the value length is too big for the allowed one.
 * @see Learn more about start parameter:
 * https://docs.telegram-mini-apps.com/platform/start-parameter
 */
export function createStartParam(value: unknown): string {
  const b64 = encodeBase64Url(typeof value === 'string' ? value : JSON.stringify(value));
  if (b64.length > 512) {
    throw new Error('Value is too long for start parameter');
  }
  return b64;
}
