import { pipe } from 'fp-ts/lib/function.js';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';

import {
  retrieveRawLaunchParams,
  retrieveRawLaunchParamsFp,
} from '@/launch-params/retrieveRawLaunchParams.js';
import type { LeftOfFnReturnType } from '@/fp/types.js';

/**
 * @returns Raw init data from any known source.
 * @throws {LaunchParamsRetrieveError} Unable to retrieve launch params from
 *   any known source.
 * @deprecated Use `retrieveRawInitDataFp`.
 */
export function retrieveRawInitData(): string | undefined {
  return new URLSearchParams(retrieveRawLaunchParams()).get('tgWebAppData') || undefined;
}

/**
 * @returns Raw init data from any known source.
 */
export function retrieveRawInitDataFp(): E.Either<
  LeftOfFnReturnType<typeof retrieveRawLaunchParamsFp>,
  O.Option<string>
> {
  return pipe(
    retrieveRawLaunchParamsFp(),
    E.chain(raw => {
      const v = new URLSearchParams(raw).get('tgWebAppData');
      return E.right(v ? O.some(v) : O.none);
    }),
  );
}
