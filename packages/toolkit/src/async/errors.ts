import { TypedError } from '@/errors/TypedError.js';
import { createTypedErrorPredicate } from '@/errors/createTypedErrorPredicate.js';

export const ERR_ABORTED = 'ERR_ABORTED';
export const ERR_CANCELED = 'ERR_CANCELED';
export const ERR_TIMED_OUT = 'ERR_TIMED_OUT';

export function createAbortError(cause?: unknown): TypedError<typeof ERR_ABORTED> {
  return new TypedError(ERR_ABORTED, { cause });
}

export const isTimeoutError = createTypedErrorPredicate(ERR_TIMED_OUT);

export const isAbortError = createTypedErrorPredicate(ERR_ABORTED);

export const isCanceledError = createTypedErrorPredicate(ERR_CANCELED);