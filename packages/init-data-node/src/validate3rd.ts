import type { Verify3rdFn } from './types.js';
import {
  AuthDateInvalidError,
  ExpiredError,
  SignatureInvalidError,
  SignatureMissingError,
} from './errors.js';

export interface Validate3rdOptions {
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
  /**
   * When true, uses the test environment public key to validate init data.
   * @default false
   */
  test?: boolean;
}

export type Validate3rdValue = string | URLSearchParams;

function processResult(verified: boolean): void | never {
  if (!verified) {
    throw new SignatureInvalidError();
  }
  return;
}

/**
 * Validates passed init data using a publicly known Ee25519 key.
 * @param value - value to check.
 * @param botId - bot identifier
 * @param verify - function to verify sign
 * @param options - additional validation options.
 * @throws {SignatureInvalidError} Signature is invalid.
 * @throws {AuthDateInvalidError} "auth_date" property is missing or invalid.
 * @throws {SignatureMissingError} "hash" property is missing.
 * @throws {ExpiredError} Init data is expired.
 */
export function validate3rd(
  value: Validate3rdValue,
  botId: number,
  verify: Verify3rdFn<false>,
  options?: Validate3rdOptions,
): void | never;

/**
 * Validates passed init data using a publicly known Ee25519 key.
 * @param value - value to check.
 * @param botId - bot identifier
 * @param verify - function to verify sign
 * @param options - additional validation options.
 * @throws {SignatureInvalidError} Signature is invalid.
 * @throws {AuthDateInvalidError} "auth_date" property is missing or invalid.
 * @throws {SignatureMissingError} "hash" property is missing.
 * @throws {ExpiredError} Init data is expired.
 */
export function validate3rd(
  value: Validate3rdValue,
  botId: number,
  verify: Verify3rdFn<true>,
  options?: Validate3rdOptions,
): Promise<void>;

export function validate3rd(
  value: Validate3rdValue,
  botId: number,
  verify: Verify3rdFn<boolean>,
  options: Validate3rdOptions = {},
): void | never | Promise<void> {
  // Init data required params.
  let authDate: Date | undefined;
  let authDateString: string | undefined;
  let signature: string | undefined;

  // All search params pairs presented as `k=v`.
  const pairs: string[] = [];

  // Iterate over all key-value pairs of parsed parameters and find required
  // parameters.
  (typeof value === 'string' ? new URLSearchParams(value) : value).forEach((value, key) => {
    if (key === 'hash') {
      return;
    }

    if (key === 'signature') {
      signature = value;
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

  // Signature and auth date always required.
  if (!signature) {
    throw new SignatureMissingError(true);
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

  const verified = verify(
    `${botId}:WebAppData\n${pairs.sort().join('\n')}`,
    options.test
      ? '40055058a4ee38156a06562e52eece92a771bcd8346a8c4615cb7376eddf72ec'
      : 'e7bf03a2fa4602af4580703d88dda5bb59f32ed8b02a56c187fe7d34caed242d',
    signature,
  );

  return typeof verified === 'boolean' ? processResult(verified) : verified.then(processResult);
}
