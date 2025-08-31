import { type LeftOfFnReturnType, eitherGet } from '@tma.js/toolkit';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function.js';

import { hashToken } from './hashToken.js';
import { arrayBufferToHex, hexToArrayBuffer } from './hex-to-array-buffer.js';
import type { CreateHmacFn, SharedOptions, Text } from './types.js';

export type SignDataOptions = SharedOptions;

/**
 * Signs specified data with the passed token.
 * @param data - data to sign.
 * @param key - private key.
 * @param createHmac - function to create HMAC-SHA256.
 * @param options - additional method options.
 * @returns Data sign.
 */
export function signData(
  data: Text,
  key: Text,
  createHmac: CreateHmacFn<false>,
  options?: SignDataOptions,
): string;

/**
 * Signs specified data with the passed token.
 * @param data - data to sign.
 * @param key - private key.
 * @param createHmac - function to create HMAC-SHA256.
 * @param options - additional method options.
 * @returns Data sign.
 */
export function signData(
  data: Text,
  key: Text,
  createHmac: CreateHmacFn<true>,
  options?: SignDataOptions,
): Promise<string>;

export function signData(
  data: Text,
  key: Text,
  createHmac: CreateHmacFn<boolean>,
  options: SignDataOptions = {},
): string | Promise<string> {
  const monad = (
    signDataFp(data, key, createHmac, options) as
    | E.Either<LeftOfFnReturnType<typeof hexToArrayBuffer>, string>
    | TE.TaskEither<LeftOfFnReturnType<typeof hexToArrayBuffer>, string>
  );
  return typeof monad === 'function' ? monad().then(eitherGet) : eitherGet(monad);
}

/**
 * Signs specified data with the passed token.
 * @param data - data to sign.
 * @param key - private key.
 * @param createHmac - function to create HMAC-SHA256.
 * @param options - additional method options.
 * @returns Data signature.
 */
export function signDataFp(
  data: Text,
  key: Text,
  createHmac: CreateHmacFn<false>,
  options?: SignDataOptions,
): E.Either<LeftOfFnReturnType<typeof hexToArrayBuffer>, string>;

/**
 * Signs specified data with the passed token.
 * @param data - data to sign.
 * @param key - private key.
 * @param createHmac - function to create HMAC-SHA256.
 * @param options - additional method options.
 * @returns Data sign.
 */
export function signDataFp(
  data: Text,
  key: Text,
  createHmac: CreateHmacFn<true>,
  options?: SignDataOptions,
): TE.TaskEither<LeftOfFnReturnType<typeof hexToArrayBuffer>, string>;

export function signDataFp(
  data: Text,
  key: Text,
  createHmac: CreateHmacFn<boolean>,
  options: SignDataOptions = {},
):
  | E.Either<LeftOfFnReturnType<typeof hexToArrayBuffer>, string>
  | TE.TaskEither<LeftOfFnReturnType<typeof hexToArrayBuffer>, string> {
  const keyHmac = options.tokenHashed
    ? typeof key === 'string'
      // If a hashed token was passed, we assume that it is a HEX string. Not to mess with
      // the createHmac function, we should convert this HEX string to ArrayBuffer. Otherwise,
      // incorrect behavior will be met.
      ? hexToArrayBuffer(key)
      : key
    : hashToken(key, createHmac);

  if (keyHmac instanceof Promise) {
    return TE.tryCatch(
      () => keyHmac.then(v => createHmac(data, v)).then(arrayBufferToHex),
      err => err as LeftOfFnReturnType<typeof hexToArrayBuffer>,
    );
  }
  return pipe(
    '_tag' in keyHmac ? keyHmac : E.right(keyHmac),
    // In this branch createHmac can't be asynchronous. If it is, keyHmac would be Promise and the
    // result would be returned in the previous "if" statement.
    E.chain(v => E.right(
      arrayBufferToHex((createHmac as CreateHmacFn<false>)(data, v))
    )),
  );
}
