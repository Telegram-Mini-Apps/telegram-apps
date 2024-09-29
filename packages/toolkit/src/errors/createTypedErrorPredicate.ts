import { TypedError } from './TypedError.js';
import { isErrorOfType } from '@/errors/isErrorOfType.js';

export function createTypedErrorPredicate<T extends string>(
  type: T,
): (value: unknown) => value is TypedError<T> {
  return (value): value is TypedError<T> => isErrorOfType(value, type);
}