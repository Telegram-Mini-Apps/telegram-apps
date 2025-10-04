import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';

import type { SafeWrappedFp } from '@/wrappers/wrap-safe-fp.js';
import type { SafeWrapped } from '@/wrappers/wrapSafe.js';
import type { AnyFn } from '@/types.js';

/**
 * A function making safe-wrapped fp function just safe-wrapped, unwrapping all fp results.
 * @param fn - a function to unwrap.
 */
export function unwrapFp<
  Fn extends AnyFn,
  HasSupportCheck extends boolean,
  SupportsMapKeySchema extends string,
>(
  fn: SafeWrappedFp<Fn, HasSupportCheck, SupportsMapKeySchema>,
): SafeWrapped<
  Fn,
  HasSupportCheck,
  SupportsMapKeySchema
> {
  return Object.assign(
    (...args: Parameters<Fn>) => {
      // Here we should have Either or TaskEither.
      const result = fn(...args);
      const onError = (e: unknown) => {
        throw e;
      };
      console.log(result);

      return typeof result === 'function'
        // The value is TaskEither. As a result, we should return a promise.
        ? pipe(result, TE.match(onError, data => data))()
        : pipe(result, E.match(onError, data => data));
    },
    fn,
    {
      ifAvailable(...args: Parameters<Fn>) {
        return pipe(
          fn.ifAvailable(...args),
          O.match(
            () => ({ ok: false }),
            data => ({ ok: true, data }),
          ),
        );
      },
    },
  ) as any;
}
