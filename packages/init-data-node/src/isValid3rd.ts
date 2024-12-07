import type { Validate3rdOptions, Validate3rdValue } from './validate3rd.js';

type ValidateSyncFn = (
  value: Validate3rdValue,
  botId: number,
  options?: Validate3rdOptions,
) => void | never;

type ValidateAsyncFn = (
  value: Validate3rdValue,
  botId: number,
  options?: Validate3rdOptions,
) => Promise<void>;

/**
 * @param value - value to check.
 * @param botId - bot identifier
 * @param validate - function validating the init data.
 * @param options - additional validation options.
 * @returns True is specified init data is signed by Telegram.
 */
export function isValid3rd(
  value: Validate3rdValue,
  botId: number,
  validate: ValidateAsyncFn,
  options?: Validate3rdOptions,
): Promise<boolean>;

/**
 * @param value - value to check.
 * @param botId - bot identifier
 * @param validate - function validating the init data.
 * @param options - additional validation options.
 * @returns True is specified init data is signed by Telegram.
 */
export function isValid3rd(
  value: Validate3rdValue,
  botId: number,
  validate: ValidateSyncFn,
  options?: Validate3rdOptions,
): boolean;

export function isValid3rd(
  value: Validate3rdValue,
  botId: number,
  validate: ValidateSyncFn | ValidateAsyncFn,
  options?: Validate3rdOptions,
): boolean | Promise<boolean> {
  try {
    const maybePromise = validate(value, botId, options);
    return maybePromise
      ? maybePromise.then(() => true, () => false)
      : true;
  } catch {
    return false;
  }
}
