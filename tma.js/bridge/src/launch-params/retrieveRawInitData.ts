import * as E from 'fp-ts/Either';
import { flow } from 'fp-ts/lib/function.js';
import * as O from 'fp-ts/Option';

import {
  retrieveRawLaunchParamsFp,
  type RetrieveRawLaunchParamsError,
} from '@/launch-params/retrieveRawLaunchParams.js';

export type RetrieveRawInitDataError = RetrieveRawLaunchParamsError;

/**
 * @returns Raw init data from any known source.
 */
export const retrieveRawInitDataFp: () => E.Either<RetrieveRawInitDataError, O.Option<string>> =
  flow(retrieveRawLaunchParamsFp, E.map(raw => {
    const v = new URLSearchParams(raw).get('tgWebAppData');
    return v ? O.some(v) : O.none;
  }));

/**
 * @see retrieveRawInitDataFp
 */
export const retrieveRawInitData: () => string | undefined = flow(
  retrieveRawInitDataFp,
  E.fold(err => {
    throw err;
  }, v => v),
  O.match(() => undefined, v => v),
);
