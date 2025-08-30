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

export function parseInitDataQuery(
  value: string | URLSearchParams,
): E.Either<ValiError<InitDataGenSchema>, InitDataGenType> {
  return E.tryCatch(
    () => parse(initDataQuery(), value),
    e => e as ValiError<InitDataGenSchema>,
  );
}

export function parseLaunchParamsQuery(
  value: string | URLSearchParams,
): E.Either<ValiError<LaunchParamsGenSchema>, LaunchParamsGenType> {
  return E.tryCatch(
    () => parse(launchParamsQuery(), value),
    e => e as ValiError<LaunchParamsGenSchema>,
  );
}
