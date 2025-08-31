import {
  AuthDateInvalidError,
  ExpiredError,
  SignatureInvalidError,
  SignatureMissingError,
} from '../errors.js';
import type { SharedOptions, SignDataAsyncFn, SignDataSyncFn, Text } from '../types.js';

export interface ValidateOptions extends SharedOptions {
  /**
   * Time in seconds which states, how long from creation time init data is considered valid.
   *
   * In other words, in case when authDate + expiresIn is before current time, init data is
   * recognized as expired.
   *
   * In case this value is equal to 0, the function does not check init data expiration.
   * @default 86400 (1 day)
   */
  expiresIn?: number;
}

export type ValidateValue = string | URLSearchParams;

function processSign(actual: string, expected: string): void | never {
  if (actual !== expected) {
    throw new SignatureInvalidError();
  }
  return;
}

/**
 * Validates passed init data.
 * @param value - value to check.
 * @param token - bot secret token.
 * @param signData - function signing data.
 * @param options - additional validation options.
 * @throws {SignatureInvalidError} Signature is invalid.
 * @throws {AuthDateInvalidError} "auth_date" property is missing or invalid.
 * @throws {SignatureMissingError} "hash" property is missing.
 * @throws {ExpiredError} Init data is expired.
 */
export function validate(
  value: ValidateValue,
  token: Text,
  signData: SignDataSyncFn,
  options?: ValidateOptions,
): void | never;

/**
 * Validates passed init data.
 * @param value - value to check.
 * @param token - bot secret token.
 * @param signData - function signing data.
 * @param options - additional validation options.
 * @throws {SignatureInvalidError} Signature is invalid.
 * @throws {AuthDateInvalidError} "auth_date" property is missing or invalid.
 * @throws {SignatureMissingError} "hash" property is missing.
 * @throws {ExpiredError} Init data is expired.
 */
export function validate(
  value: ValidateValue,
  token: Text,
  signData: SignDataAsyncFn,
  options?: ValidateOptions,
): Promise<void>;

export function validate(
  value: ValidateValue,
  token: Text,
  signData: SignDataSyncFn | SignDataAsyncFn,
  options: ValidateOptions = {},
): void | never | Promise<void> {
  // Init data required params.
  let authDate: Date | undefined;
  let authDateString: string | undefined;
  let hash: string | undefined;

  // All search params pairs presented as `k=v`.
  const pairs: string[] = [];

  // Iterate over all key-value pairs of parsed parameters and find required
  // parameters.
  (typeof value === 'string' ? new URLSearchParams(value) : value).forEach((value, key) => {
    if (key === 'hash') {
      hash = value;
      return;
    }

    if (key === 'auth_date') {
      authDateString = value;
      const authDateNum = parseInt(value, 10);
      if (!Number.isNaN(authDateNum)) {
        authDate = new Date(authDateNum * 1000);
      }
    }

    pairs.push(`${key}=${value}`);
  });

  // Hash and auth date always required.
  if (!hash) {
    throw new SignatureMissingError(false);
  }

  if (!authDate) {
    throw new AuthDateInvalidError(authDateString);
  }

  // In case, expiration time passed, we do additional parameters check.
  const { expiresIn = 86400 } = options;
  if (expiresIn > 0) {
    // Check if init data expired.
    const expiresAtTs = authDate.getTime() + expiresIn * 1000;
    const nowTs = Date.now();
    if (expiresAtTs < nowTs) {
      throw new ExpiredError(authDate, new Date(expiresAtTs), new Date(nowTs));
    }
  }

  // According to docs, we sort all the pairs in alphabetical order.
  pairs.sort();

  const sign = signData(pairs.join('\n'), token, options);

  return typeof sign === 'string'
    ? processSign(sign, hash)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    : sign.then(v => processSign(v, hash!));
}
