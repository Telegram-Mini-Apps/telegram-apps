import { eitherFnToSimple } from '@tma.js/toolkit';
import * as E from 'fp-ts/Either';

import { encodeBase64Url } from '@/base64-url/encode.js';

/**
 * Creates a safe start parameter value. If the value is not a string, the
 * function applies JSON.stringify to it, so make sure you are not passing an
 * object with circular references.
 *
 * @param value - value to create start parameter from.
 * @see Learn more about start parameter:
 * https://docs.telegram-mini-apps.com/platform/start-parameter
 */
export function createStartParamFp(value: unknown): E.Either<Error, string> {
  const b64 = encodeBase64Url(typeof value === 'string' ? value : JSON.stringify(value));
  return b64.length > 512
    ? E.left(new Error('Value is too long for start parameter'))
    : E.right(b64);
}

/**
 * @see createStartParamFp
 */
export const createStartParam = eitherFnToSimple(createStartParamFp);
