import type { Text } from './types.js';
import type { ValidateOptions, ValidateValue } from './validate.js';

type ValidateSyncFn = (
  value: ValidateValue,
  token: Text,
  options?: ValidateOptions,
) => void | never;

type ValidateAsyncFn = (
  value: ValidateValue,
  token: Text,
  options?: ValidateOptions,
) => Promise<void>;

/**
 * @param value - value to check.
 * @param token - bot secret token.
 * @param validate - function validating the init data.
 * @param options - additional validation options.
 * @returns True is specified init data is valid.
 */
export function isValid(
  value: ValidateValue,
  token: Text,
  validate: ValidateSyncFn,
  options?: ValidateOptions,
): boolean;

/**
 * @param value - value to check.
 * @param token - bot secret token.
 * @param validate - function validating the init data.
 * @param options - additional validation options.
 * @returns True is specified init data is valid.
 */
export function isValid(
  value: ValidateValue,
  token: Text,
  validate: ValidateAsyncFn,
  options?: ValidateOptions,
): Promise<boolean>;

export function isValid(
  value: ValidateValue,
  token: Text,
  validate: ValidateSyncFn | ValidateAsyncFn,
  options?: ValidateOptions,
): boolean | Promise<boolean> {
  try {
    const maybePromise = validate(value, token, options);
    return maybePromise
      ? maybePromise.then(() => true, () => false)
      : true;
  } catch {
    return false;
  }
}
