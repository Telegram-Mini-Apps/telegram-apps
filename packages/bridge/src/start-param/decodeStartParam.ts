import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function.js';

import {
  decodeBase64Url,
  decodeBase64UrlFp,
} from '@/base64-url/decodeBase64Url.js';

/**
 * Decodes a start parameter using a custom parser.
 * @param value - a start parameter value.
 * @param parse - a custom value parser.
 * @see decodeBase64Url
 * @deprecated Use `decodeStartParamFp`
 */
export function decodeStartParam<T>(value: string, parse: (value: string) => T): T;
/**
 * Decodes a start parameter assuming that the result is a JSON value.
 * @param value - a start parameter value.
 * @param as - result kind.
 * @see decodeBase64Url
 * @deprecated Use `decodeStartParamFp`
 */
export function decodeStartParam(value: string, as: 'json'): unknown;
/**
 * Decodes a start parameter and returns its decoded representation.
 * @param value - a value to decode.
 * @see decodeBase64Url
 * @deprecated Use `decodeStartParamFp`
 */
export function decodeStartParam(value: string): string;
export function decodeStartParam<T>(
  value: string,
  arg2?: 'json' | ((value: string) => T),
): string | unknown | T {
  const decoded = decodeBase64Url(value);
  return arg2 === 'json'
    ? JSON.parse(decoded)
    : arg2
      ? arg2(decoded)
      : decoded;
}

/**
 * Decodes a start parameter using a custom parser.
 * @param value - a start parameter value.
 * @param parse - a custom value parser.
 * @see decodeBase64Url
 */
export function decodeStartParamFp<L, R>(
  value: string,
  parse: (value: string) => E.Either<L, R>,
): E.Either<L, R>;
/**
 * Decodes a start parameter assuming that the result is a JSON value.
 * @param value - a start parameter value.
 * @param as - result kind.
 * @see decodeBase64Url
 */
export function decodeStartParamFp(
  value: string,
  as: 'json',
): E.Either<SyntaxError | DOMException, unknown>;
/**
 * Decodes a start parameter and returns its decoded representation.
 * @param value - a value to decode.
 * @see decodeBase64Url
 */
export function decodeStartParamFp(value: string): E.Either<DOMException, string>;
export function decodeStartParamFp<L, R>(
  value: string,
  arg2?: 'json' | ((value: string) => E.Either<L, R>),
): E.Either<DOMException | SyntaxError | L, unknown> {
  return pipe(
    decodeBase64UrlFp(value),
    E.chain<DOMException | SyntaxError | L, string, unknown>(
      decoded => {
        if (!arg2) {
          return E.right(decoded);
        }
        if (typeof arg2 === 'function') {
          return arg2(decoded);
        }
        return E.tryCatch<SyntaxError, unknown>(
          () => JSON.parse(decoded),
          e => e as SyntaxError,
        );
      },
    ),
  );
}
