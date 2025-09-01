import { eitherFnToSimple } from '@tma.js/toolkit';
import {
  type LaunchParamsGenType,
  type ParseLaunchParamsQueryError,
  parseLaunchParamsQueryFp,
} from '@tma.js/transformers';
import * as E from 'fp-ts/Either';
import { flow } from 'fp-ts/lib/function.js';

import {
  type RetrieveRawLaunchParamsError,
  retrieveRawLaunchParamsFp,
} from '@/launch-params/retrieveRawLaunchParams.js';

export type RetrieveLaunchParamsError = RetrieveRawLaunchParamsError | ParseLaunchParamsQueryError;

/**
 * @returns Launch parameters from any known source.
 */
export const retrieveLaunchParamsFp: () => E.Either<
  RetrieveLaunchParamsError,
  LaunchParamsGenType
> = flow(retrieveRawLaunchParamsFp, E.chainW(parseLaunchParamsQueryFp));

/**
 * @see retrieveLaunchParamsFp
 */
export const retrieveLaunchParams = eitherFnToSimple(retrieveLaunchParamsFp);
