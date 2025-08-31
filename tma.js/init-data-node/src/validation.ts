import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function.js';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';

import {
  AuthDateInvalidError,
  ExpiredError,
  SignatureInvalidError,
  SignatureMissingError,
} from './errors.js';
import { Text } from './types.js';

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

export type Validate3rdError =
  | InstanceType<typeof SignatureMissingError>
  | InstanceType<typeof SignatureInvalidError>
  | InstanceType<typeof AuthDateInvalidError>
  | InstanceType<typeof ExpiredError>;

export type Validate3rdValue = string | URLSearchParams;

interface ValidateSignDataFpArg<Async extends boolean, Left> {
  (data: Text, key: Text, options?: ValidateOptions): Async extends true
    ? TE.TaskEither<Left, string>
    : E.Either<Left, string>;
}

export interface ValidateOptions {
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
   * True, if token is already hashed.
   * @default false
   */
  tokenHashed?: boolean;
}

export type ValidateValue = string | URLSearchParams;

export type ValidateError =
  | InstanceType<typeof SignatureMissingError>
  | InstanceType<typeof SignatureInvalidError>
  | InstanceType<typeof AuthDateInvalidError>
  | InstanceType<typeof ExpiredError>;

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
export function validate3rd(
  value: Validate3rdValue,
  botId: number,
  options?: Validate3rdOptions,
): Promise<void> {
  return pipe(validate3rdFp(value, botId, options), TO.match(() => undefined, err => {
    throw err;
  }))();
}

/**
 * Validates passed init data using a publicly known Ee25519 key.
 * @param value - value to check.
 * @param botId - bot identifier
 * @param options - additional validation options.
 */
export function validate3rdFp(
  value: Validate3rdValue,
  botId: number,
  options: Validate3rdOptions = {},
): TO.TaskOption<Validate3rdError> {
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
    return TO.some(new SignatureMissingError(true));
  }

  if (!authDate) {
    return TO.some(new AuthDateInvalidError(authDateString));
  }

  // In case, expiration time passed, we do additional parameters check.
  const { expiresIn = 86400 } = options;
  if (expiresIn > 0) {
    // Check if init data expired.
    const expiresAtTs = authDate.getTime() + (expiresIn * 1000);
    const nowTs = Date.now();
    if (expiresAtTs < nowTs) {
      return TO.some(new ExpiredError(authDate, new Date(expiresAtTs), new Date(nowTs)));
    }
  }

  return pipe(
    TO.tryCatch(async () => crypto.subtle.verify(
      'Ed25519',
      await crypto.subtle.importKey(
        'raw',
        Buffer.from(
          options.test
            ? '40055058a4ee38156a06562e52eece92a771bcd8346a8c4615cb7376eddf72ec'
            : 'e7bf03a2fa4602af4580703d88dda5bb59f32ed8b02a56c187fe7d34caed242d',
          'hex',
        ),
        'Ed25519',
        false,
        ['verify'],
      ),
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      Buffer.from(signature as string, 'base64'),
      Buffer.from(`${botId}:WebAppData\n${pairs.sort().join('\n')}`),
    )),
    TO.chain(isVerified => (isVerified ? TO.none : TO.some(new SignatureInvalidError()))),
  );
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
  return pipe(isValid3rdFp(value, botId, options), TO.match(() => false, v => v))();
}

/**
 * @param value - value to check.
 * @param botId - bot identifier
 * @param options - additional validation options.
 * @returns True is specified init data is signed by Telegram.
 */
export function isValid3rdFp(
  value: Validate3rdValue,
  botId: number,
  options?: Validate3rdOptions,
): TO.TaskOption<boolean> {
  return pipe(validate3rdFp(value, botId, options), TO.match(
    () => O.some(true),
    () => O.some(false),
  ));
}

export function validateFp<Left>(
  async: false,
  value: ValidateValue,
  token: Text,
  signData: ValidateSignDataFpArg<false, Left>,
  options?: ValidateOptions,
): O.Option<Left | ValidateError>;

export function validateFp<Left>(
  async: true,
  value: ValidateValue,
  token: Text,
  signData: ValidateSignDataFpArg<true, Left>,
  options?: ValidateOptions,
): TO.TaskOption<Left | ValidateError>;

export function validateFp<Left>(
  async: boolean,
  value: ValidateValue,
  token: Text,
  signData: ValidateSignDataFpArg<boolean, Left>,
  options: ValidateOptions = {},
):
  | TO.TaskOption<Left | ValidateError>
  | O.Option<Left | ValidateError> {
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
    return (async ? TO.some : O.some)(new SignatureMissingError(false));
  }

  if (!authDate) {
    return (async ? TO.some : O.some)(new AuthDateInvalidError(authDateString));
  }

  // In case, expiration time passed, we do additional parameters check.
  const { expiresIn = 86400 } = options;
  if (expiresIn > 0) {
    // Check if init data expired.
    const expiresAtTs = authDate.getTime() + (expiresIn * 1000);
    const nowTs = Date.now();
    if (expiresAtTs < nowTs) {
      return (async ? TO.some : O.some)(
        new ExpiredError(authDate, new Date(expiresAtTs), new Date(nowTs)),
      );
    }
  }

  // According to docs, we sort all the pairs in alphabetical order.
  pairs.sort();

  const eitherSignature = signData(pairs.join('\n'), token, options);
  const onLeft = (e: Left) => O.some(e);
  const onRight = (signature: string) => (
    signature === hash ? O.none : O.some(new SignatureInvalidError())
  );

  return typeof eitherSignature === 'function'
    ? pipe(eitherSignature, TE.matchW(onLeft, onRight))
    : pipe(eitherSignature, E.matchW(onLeft, onRight));
}
