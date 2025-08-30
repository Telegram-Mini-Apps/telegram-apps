import { type Either, left, right } from 'fp-ts/Either';

import { encodeBase64Url } from '@/base64-url/encodeBase64Url.js';
import { wrapEitherGet } from '@/fp/wrapEitherGet.js';

/**
 * Creates a safe start parameter value. If the value is not a string, the
 * function applies JSON.stringify to it, so make sure you are not passing an
 * object with circular references.
 *
 * @param value - value to create start parameter from.
 * @throws {Error} If the value length is too big for the allowed one.
 * @see Learn more about start parameter:
 * https://docs.telegram-mini-apps.com/platform/start-parameter
 * @deprecated Use `createStartParamFp`
 */
export const createStartParam = wrapEitherGet(createStartParamFp);

/**
 * Creates a safe start parameter value. If the value is not a string, the
 * function applies JSON.stringify to it, so make sure you are not passing an
 * object with circular references.
 *
 * @param value - value to create start parameter from.
 * @see Learn more about start parameter:
 * https://docs.telegram-mini-apps.com/platform/start-parameter
 */
export function createStartParamFp(value: unknown): Either<Error, string> {
  const b64 = encodeBase64Url(typeof value === 'string' ? value : JSON.stringify(value));
  return b64.length > 512
    ? left(new Error('Value is too long for start parameter'))
    : right(b64);
}