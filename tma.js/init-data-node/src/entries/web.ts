import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/lib/function.js';

import { hashToken as _hashToken } from '../hashToken.js';
import { signDataFp as _signDataFp, SignDataError, type SignDataOptions } from '../signDataFp.js';
import {
  signFp as _signFp,
  type SignableData,
  type SignOptions,
} from '../signFp.js';
import type { CreateHmacFn, Text } from '../types.js';
import {
  validateFp as _validateFp,
  type ValidateError,
  type ValidateOptions,
  type ValidateValue,
} from '../validation.js';

const createHmac: CreateHmacFn<true> = async (data, key) => {
  const encoder = new TextEncoder();

  return crypto.subtle.sign(
    'HMAC',
    await crypto.subtle.importKey(
      'raw',
      typeof key === 'string' ? encoder.encode(key) : key,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify'],
    ),
    typeof data === 'string' ? encoder.encode(data) : data,
  );
};

/**
 * Hashes specified token using a string, expected during init data sign.
 * @param token - token to hash.
 */
export function hashToken(token: Text): Promise<ArrayBuffer> {
  return _hashToken(token, createHmac);
}

/**
 * @param value - value to check.
 * @param token - bot secret token.
 * @param options - additional validation options.
 * @returns True is specified init data is valid.
 */
export function isValid(
  value: ValidateValue,
  token: Text,
  options?: ValidateOptions,
): Promise<boolean> {
  return pipe(
    validateFp(value, token, options),
    TO.match(() => true, () => false),
  )();
}

/**
 * Signs specified init data.
 * @param data - init data to sign.
 * @param authDate - date, when this init data should be signed.
 * @param key - private key.
 * @param options - additional options.
 * @returns Signed init data presented as query parameters.
 */
export function sign(
  data: SignableData,
  key: Text,
  authDate: Date,
  options?: SignOptions,
): Promise<string> {
  return pipe(
    signFp(data, key, authDate, options),
    TE.match(e => {
      throw e;
    }, v => v),
  )();
}

/**
 * Signs specified init data.
 * @param data - init data to sign.
 * @param authDate - date, when this init data should be signed.
 * @param key - private key.
 * @param options - additional options.
 * @returns Signed init data presented as query parameters.
 */
export function signFp(
  data: SignableData,
  key: Text,
  authDate: Date,
  options?: SignOptions,
): TE.TaskEither<SignDataError, string> {
  return _signFp(data, key, authDate, signDataFp, options);
}

/**
 * Signs specified data with the passed token.
 * @param data - data to sign.
 * @param key - private key.
 * @param options - additional options.
 * @returns Data sign.
 */
export function signData(data: Text, key: Text, options?: SignDataOptions): Promise<string> {
  return pipe(
    signDataFp(data, key, options),
    TE.match(e => {
      throw e;
    }, v => v),
  )();
}

/**
 * Signs specified data with the passed token.
 * @param data - data to sign.
 * @param key - private key.
 * @param options - additional options.
 * @returns Data sign.
 */
export function signDataFp(
  data: Text,
  key: Text,
  options?: SignDataOptions,
): TE.TaskEither<SignDataError, string> {
  return _signDataFp(true, data, key, createHmac, options);
}

/**
 * Validates passed init data.
 * @param value - value to check.
 * @param token - bot secret token.
 * @param options - additional validation options.
 * @throws {SignatureInvalidError} Signature is invalid.
 * @throws {AuthDateInvalidError} "auth_date" property is missing or invalid.
 * @throws {SignatureMissingError} "hash" property is missing.
 * @throws {ExpiredError} Init data is expired.
 */
export function validate(
  value: ValidateValue,
  token: Text,
  options?: ValidateOptions,
): Promise<void> {
  return pipe(
    validateFp(value, token, options),
    TO.match(() => undefined, e => {
      throw e;
    }),
  )();
}

/**
 * Validates passed init data.
 * @param value - value to check.
 * @param token - bot secret token.
 * @param options - additional validation options.
 */
export function validateFp(
  value: ValidateValue,
  token: Text,
  options?: ValidateOptions,
): TO.TaskOption<ValidateError> {
  return _validateFp(true, value, token, signDataFp, options);
}

export * from './shared.js';
