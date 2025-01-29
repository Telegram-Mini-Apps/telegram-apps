import { LaunchParamsSchema, parseLaunchParamsQuery } from '@telegram-apps/transformers';
import {
  type DeepConvertSnakeKeysToCamelCase,
  deepSnakeToCamelObjKeys,
  setStorageValue,
} from '@telegram-apps/toolkit';
import type { InferOutput } from 'valibot';

import { LaunchParamsRetrieveError } from '@/errors.js';
import { forEachLpSource } from '@/launch-params/forEachLpSource.js';

export type RetrieveLPResult = InferOutput<typeof LaunchParamsSchema>;
export type RetrieveLPResultCamelCased =
  DeepConvertSnakeKeysToCamelCase<InferOutput<typeof LaunchParamsSchema>>;

/**
 * @returns Launch parameters from any known source.
 * @param camelCase - should the output be camel-cased.
 * @throws {LaunchParamsRetrieveError} Unable to retrieve launch parameters. They are probably
 * invalid.
 */
export function retrieveLaunchParams(camelCase?: false): RetrieveLPResult;

/**
 * @returns Launch parameters from any known source.
 * @param camelCase - should the output be camel-cased.
 * @throws {LaunchParamsRetrieveError} Unable to retrieve launch parameters. They are probably
 * invalid.
 */
export function retrieveLaunchParams(camelCase: true): RetrieveLPResultCamelCased;

/**
 * @returns Launch parameters from any known source.
 * @throws {LaunchParamsRetrieveError} Unable to retrieve launch parameters. They are probably
 * invalid.
 */
export function retrieveLaunchParams(camelCase?: boolean):
  | RetrieveLPResult
  | RetrieveLPResultCamelCased {
  const errors: unknown[] = [];
  let launchParams: RetrieveLPResult | undefined;

  forEachLpSource(v => {
    try {
      launchParams = parseLaunchParamsQuery(v);
      setStorageValue('launchParams', v);
      return false;
    } catch (e) {
      errors.push(e);
      return true;
    }
  });
  if (!launchParams) {
    throw new LaunchParamsRetrieveError(errors);
  }
  return camelCase ? deepSnakeToCamelObjKeys(launchParams) : launchParams;
}
