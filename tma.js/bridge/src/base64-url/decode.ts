import { eitherFnToSimple } from '@tma.js/toolkit';
import * as E from 'fp-ts/Either';

/**
 * Decodes a base-64-url ASCII string.
 * @param value - the value to decode.
 * @see Learn more about base64url:
 * https://herongyang.com/Encoding/Base64URL-Encoding-Algorithm.html
 * @see Source:
 * https://developer.mozilla.org/ru/docs/Glossary/Base64#solution_1_–_escaping_the_string_before_encoding_it
 */
export function decodeBase64UrlFp(value: string): E.Either<DOMException, string> {
  return E.tryCatch(() => {
    return decodeURIComponent(
      atob(value)
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
  }, e => e as DOMException);
}

/**
 * @see decodeBase64UrlFp
 */
export const decodeBase64Url = eitherFnToSimple(decodeBase64UrlFp);
