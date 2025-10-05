import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import type { LeftOfReturn, RightOfReturn } from '@tma.js/toolkit';

import type { WithChecksFp, WithChecks } from '@/wrappers/withChecksFp.js';
import type { AnyFn } from '@/types.js';

export function throwifyWithChecksFp<
  Fn extends AnyFn,
  HasSupportCheck extends boolean,
  SupportsMapKeySchema extends string,
>(
  fn: WithChecksFp<Fn, HasSupportCheck, SupportsMapKeySchema>,
): WithChecks<Fn, HasSupportCheck, SupportsMapKeySchema> {
  const onError = (e: unknown) => {
    throw e;
  };

  type FnWrapped = WithChecksFp<Fn, HasSupportCheck, SupportsMapKeySchema>;
  type Left = LeftOfReturn<FnWrapped>;
  type Right = RightOfReturn<FnWrapped>;

  return Object.assign(
    (...args: Parameters<Fn>) => {
      const result = fn(...args);
      return typeof result === 'function'
        ? pipe(result as TE.TaskEither<Left, Right>, TE.match(onError, data => data))()
        : pipe(result as E.Either<Left, Right>, E.match(onError, data => data));
    },
    fn,
    {
      ifAvailable(...args: Parameters<Fn>) {
        return pipe(
          fn.ifAvailable(...args),
          O.match(
            () => ({ ok: false }),
            data => ({
              ok: true,
              data: typeof data === 'function'
                ? pipe(data as TE.TaskEither<Left, Right>, TE.match(onError, data => data))()
                : pipe(data as E.Either<Left, Right>, E.match(onError, data => data)),
            }),
          ),
        );
      },
    },
  ) as WithChecks<Fn, HasSupportCheck, SupportsMapKeySchema>;
}
