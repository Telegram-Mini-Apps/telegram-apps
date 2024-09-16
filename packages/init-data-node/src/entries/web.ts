import { hashToken as _hashToken } from '../hashToken.js';
import { sign as _sign, SignOptions } from '../sign.js';
import { signData as _signData, SignDataOptions } from '../signData.js';
import { validate as _validate, type ValidateOptions, type ValidateValue } from '../validate.js';
import { isValid as _isValid } from '../isValid.js';
import type { CreateHmacFn, SignData, Text } from '../types.js';

const createHmac: CreateHmacFn<true> = async (data, key) => {
  const encoder = new TextEncoder();

  return Buffer.from(
    await crypto.subtle.sign(
      'HMAC',
      await crypto.subtle.importKey(
        'raw',
        typeof key === 'string' ? encoder.encode(key) : key,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify'],
      ),
      encoder.encode(data.toString()),
    ),
  );
};


/**
 * Hashes specified token using a string, expected during init data sign.
 * @param token - token to hash.
 */
export function hashToken(token: Text): Promise<Buffer> {
  return _hashToken(token, createHmac);
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
export function sign(
  data: SignData,
  key: Text,
  authDate: Date,
  options?: SignOptions
): Promise<string> {
  return _sign(data, key, authDate, signData, options);
}

/**
 * Signs specified data with the passed token.
 * @param data - data to sign.
 * @param key - private key.
 * @param options - additional options.
 * @returns Data sign.
 */
export function signData(data: Text, key: Text, options?: SignDataOptions): Promise<string> {
  return _signData(data, key, createHmac, options);
}

/**
 * Validates passed init data.
 * @param value - value to check.
 * @param token - bot secret token.
 * @param options - additional validation options.
 * @throws {TypeError} "auth_date" should present integer
 * @throws {Error} "hash" is empty or not found
 * @throws {Error} "auth_date" is empty or not found
 * @throws {Error} Init data expired
 */
export function validate(
  value: ValidateValue,
  token: Text,
  options?: ValidateOptions,
): Promise<void> {
  return Promise.resolve().then(() => _validate(value, token, signData, options));
}

export * from './shared.js';
