import type { Verify3rdFn } from '../types.js';
import { isValid3rd as _isValid3rd } from '../validation/isValid3rd.js';
import {
  validate3rd as _validate3rd,
  type Validate3rdOptions,
  type Validate3rdValue,
} from '../validation/validate3rd.js';

export type { Chat, ChatType, InitData, User } from '@telegram-apps/types';

export {
  AuthDateInvalidError, ExpiredError, isAuthDateInvalidError,
  isExpiredError,
  isSignatureInvalidError, isSignatureMissingError, SignatureInvalidError, SignatureMissingError
} from '../errors.js';
export { parse } from '../parse.js';
export type { CreateHmacFn, SignData, Text } from '../types.js';
export type { ValidateOptions, ValidateValue } from '../validation/validate.js';

export type { Validate3rdOptions, Validate3rdValue, Verify3rdFn };

const verify3rd: Verify3rdFn<true> = async (data, key, signature) => {
  return crypto.subtle.verify(
    'Ed25519',
    await crypto
      .subtle
      .importKey('raw', Buffer.from(key, 'hex'), 'Ed25519', false, ['verify']),
    Buffer.from(signature, 'base64'),
    Buffer.from(data),
  );
};

/**
 * Validates passed init data using a publicly known Ee25519 key.
 * @param value - value to check.
 * @param botId - bot identifier
 * @param options - additional validation options.
 * @throws {SignatureInvalidError} Signature is invalid.
 * @throws {AuthDateInvalidError} "auth_date" property is missing or invalid.
 * @throws {SignatureMissingError} "hash" property is missing.
 * @throws {ExpiredError} Init data is expired.
 */
export async function validate3rd(
  value: Validate3rdValue,
  botId: number,
  options?: Validate3rdOptions,
): Promise<void> {
  return _validate3rd(value, botId, verify3rd, options);
}

/**
 * @param value - value to check.
 * @param botId - bot identifier
 * @param options - additional validation options.
 * @returns True is specified init data is signed by Telegram.
 */
export function isValid3rd(
  value: Validate3rdValue,
  botId: number,
  options?: Validate3rdOptions,
): Promise<boolean> {
  return _isValid3rd(value, botId, validate3rd, options);
}
