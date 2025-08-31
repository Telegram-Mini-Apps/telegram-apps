import { createHmac as nodeCreateHmac } from 'node:crypto';

import { hashToken as _hashToken } from '../hashToken.js';
import { sign as _sign, SignOptions } from '../sign.js';
import { signData as _signData, SignDataOptions } from '../signData.js';
import type { CreateHmacFn, SignData, Text } from '../types.js';
import { isValid as _isValid } from '../validation/isValid.js';
import { validate as _validate, type ValidateOptions, type ValidateValue } from '../validation/validate.js';

/**
 * Converts Text to Node.js Buffer.
 * @param text - text to convert
 */
function textToBuffer(text: Text): Buffer {
  return Buffer.from(typeof text === 'string' ? text : new Uint8Array(text));
}

const createHmac: CreateHmacFn<false> = (data, key) => {
  return nodeCreateHmac('sha256', textToBuffer(key))
    .update(textToBuffer(data))
    .digest();
};

/**
 * Hashes specified token using a string, expected during init data sign.
 * @param token - token to hash.
 */
export function hashToken(token: Text): Buffer {
  return Buffer.from(_hashToken(token, createHmac));
}

/**
 * @param value - value to check.
 * @param token - bot secret token.
 * @param options - additional validation options.
 * @returns True is specified init data is valid.
 */
export function isValid(value: ValidateValue, token: Text, options?: ValidateOptions): boolean {
  return _isValid(value, token, validate, options);
}

/**
 * Signs specified init data.
 * @param data - init data to sign.
 * @param authDate - date, when this init data should be signed.
 * @param key - private key.
 * @param options - additional options.
 * @returns Signed init data presented as query parameters.
 */
export function sign(data: SignData, key: Text, authDate: Date, options?: SignOptions): string {
  return _sign(data, key, authDate, signData, options);
}

/**
 * Signs specified data with the passed token.
 * @param data - data to sign.
 * @param key - private key.
 * @param options - additional options.
 * @returns Data sign.
 */
export function signData(data: Text, key: Text, options?: SignDataOptions): string {
  return _signData(data, key, createHmac, options);
}

/**
 * Validates passed init data.
 * @param value - value to check.
 * @param token - bot secret token.
 * @param options - additional validation options.
 * @throws {TypeError} "auth_date" should present integer
 * @throws {SignatureInvalidError} Signature is invalid.
 * @throws {AuthDateInvalidError} "auth_date" property is missing or invalid.
 * @throws {SignatureMissingError} "hash" property is missing.
 * @throws {ExpiredError} Init data is expired.
 */
export function validate(
  value: ValidateValue,
  token: Text,
  options?: ValidateOptions,
): void {
  return _validate(value, token, signData, options);
}

export * from './shared.js';
