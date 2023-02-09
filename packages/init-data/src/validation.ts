import {createHmac} from 'node:crypto';

export interface ValidateOptions {
  /**
   * Time in seconds which states, how long from creation time is init data
   * considered valid.
   *
   * In other words, in case, when authDate + expiresIn is before current
   * time, init data recognized as expired.
   *
   * In case, this value is equal to 0, function does not check init data
   * expiration.
   * @default 86400 (1 day)
   */
  expiresIn?: number;
}

/**
 * Validates passed init data presented as search params converted to string,
 * or its object presentation.
 *
 * @param sp - search parameters.
 * @param token - Telegram bot secret token.
 * @param options - validation options.
 * @see toSearchParams
 * @throws {TypeError} "hash" should be string.
 * @throws {Error} "hash" is empty or not found.
 * @throws {TypeError} "auth_date" should be string.
 * @throws {TypeError} "auth_date" does not represent integer.
 * @throws {Error} "auth_date" is empty or not found.
 * @throws {Error} Init data expired.
 * @throws {Error} Sign invalid.
 */
export function validate(
  sp: string | URLSearchParams,
  token: string,
  options: ValidateOptions = {},
): void {
  const searchParams = typeof sp === 'string' ? new URLSearchParams(sp) : sp;

  // Init data creation time.
  let authDate = new Date(0);

  // Init data sign.
  let hash = '';

  // All search params pairs presented as `k=v`.
  const pairs: string[] = [];

  // Iterate over all key-value pairs of parsed parameters and find required
  // parameters.
  searchParams.forEach((value, key) => {
    if (key === 'hash') {
      hash = value;
      return;
    }

    if (key === 'auth_date') {
      const authDateNum = parseInt(value);

      if (Number.isNaN(authDateNum)) {
        throw new TypeError('"auth_date" should present integer');
      }
      authDate = new Date(authDateNum * 1000);
    }

    // Append new pair.
    pairs.push(`${key}=${value}`);
  });

  // Hash and auth date always required.
  if (hash.length === 0) {
    throw new Error('"hash" is empty or not found');
  }

  if (authDate.getTime() === 0) {
    throw new Error('"auth_date" is empty or not found');
  }

  // In case, expiration time passed, we do additional parameters check.
  const {expiresIn = 86400} = options;

  if (expiresIn > 0) {
    // Check if init data expired.
    if (authDate.getTime() + expiresIn * 1000 < new Date().getTime()) {
      throw new Error('Init data expired');
    }
  }

  // According to docs, we sort all the pairs in alphabetical order.
  pairs.sort();

  // Compute sign.
  const computedHash = createHmac(
    'sha256',
    createHmac('sha256', 'WebAppData').update(token).digest(),
  )
    .update(pairs.join('\n'))
    .digest()
    .toString('hex');

  // In case, our sign is not equal to found one, we should throw an error.
  if (computedHash !== hash) {
    throw new Error('Signature is invalid');
  }
}
