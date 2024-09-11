import { TypedError } from './TypedError.js';

export function createTypedErrorPredicate<T extends string>(
  type: T,
): (value: unknown) => value is TypedError<T> {
  return (value): value is TypedError<T> => {
    return value instanceof TypedError && value.type === type;
  };
}