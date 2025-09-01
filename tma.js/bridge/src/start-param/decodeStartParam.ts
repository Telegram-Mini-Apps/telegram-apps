import { eitherGet } from '@tma.js/toolkit';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function.js';
import * as J from 'fp-ts/lib/Json.js';

import { type DecodeBase64UrlError, decodeBase64UrlFp } from '@/base64-url/decode.js';

/**
 * @see decodeStartParamFp
 */
export function decodeStartParam<T>(value: string, parse: (value: string) => T): T;
/**
 * @see decodeStartParamFp
 */
export function decodeStartParam(value: string, as: 'json'): J.Json;
/**
 * @see decodeStartParamFp
 */
export function decodeStartParam(value: string): string;
export function decodeStartParam<T>(
  value: string,
  arg2?: 'json' | ((value: string) => T),
): string | unknown | T {
  return eitherGet(
    decodeStartParamFp(
      value,
      // @ts-expect-error The problem is in overrides. Everything is fine here.
      typeof arg2 === 'function'
        ? (value: string) => E.tryCatch(() => arg2(value), e => e)
        : arg2,
    ),
  );
}

/**
 * Decodes a start parameter using a custom parser.
 * @param value - a start parameter value.
 * @param parse - a custom value parser.
 */
export function decodeStartParamFp<L, R>(
  value: string,
  parse: (value: string) => E.Either<L, R>,
): E.Either<L | DecodeBase64UrlError, R>;
/**
 * Decodes a start parameter assuming that the result is a JSON value.
 * @param value - a start parameter value.
 * @param as - result kind.
 */
export function decodeStartParamFp(
  value: string,
  as: 'json',
): E.Either<SyntaxError | DecodeBase64UrlError, J.Json>;
/**
 * Decodes a start parameter and returns its decoded representation.
 * @param value - a value to decode.
 */
export function decodeStartParamFp(value: string): E.Either<DecodeBase64UrlError, string>;
export function decodeStartParamFp<L, R>(
  value: string,
  arg2?: 'json' | ((value: string) => E.Either<L, R>),
): E.Either<DecodeBase64UrlError | SyntaxError | L, R | string | J.Json> {
  return pipe(
    decodeBase64UrlFp(value),
    E.chain<DecodeBase64UrlError | SyntaxError | L, string, R | string | J.Json>(decoded => {
      if (!arg2) {
        return E.right(decoded);
      }
      if (typeof arg2 === 'function') {
        return arg2(decoded);
      }
      return J.parse(decoded) as E.Either<SyntaxError, J.Json>;
    }),
  );
}
