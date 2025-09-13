import { eitherFnToSimple } from '@tma.js/toolkit';
import * as E from 'fp-ts/Either';
import { parse, type ValiError } from 'valibot';

import {
  type InitDataGenSchema,
  type InitDataGenType,
  initDataQuery,
  type LaunchParamsGenSchema,
  type LaunchParamsGenType,
  launchParamsQuery,
} from './structures.js';

export type ParseInitDataQueryError = ValiError<InitDataGenSchema>;
export type ParseLaunchParamsQueryError = ValiError<LaunchParamsGenSchema>;

export function parseInitDataQueryFp(value: string | URLSearchParams): E.Either<
  ParseInitDataQueryError,
  InitDataGenType
> {
  return E.tryCatch(
    () => parse(initDataQuery(), value),
    e => e as ValiError<InitDataGenSchema>,
  );
}

export function parseLaunchParamsQueryFp(value: string | URLSearchParams): E.Either<
  ParseLaunchParamsQueryError,
  LaunchParamsGenType
> {
  return E.tryCatch(
    () => parse(launchParamsQuery(), value),
    e => e as ValiError<LaunchParamsGenSchema>,
  );
}

export const parseInitDataQuery = eitherFnToSimple(parseInitDataQueryFp);
export const parseLaunchParamsQuery = eitherFnToSimple(parseLaunchParamsQueryFp);
