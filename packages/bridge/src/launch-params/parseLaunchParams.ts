import { parse } from 'valibot';
import { launchParamsQuery, type LaunchParamsShape } from '@telegram-apps/transformers';

/**
 * Parses value as launch parameters.
 * @param value - value to parse.
 */
export function parseLaunchParams(value: string | URLSearchParams): LaunchParamsShape {
  return parse(launchParamsQuery(), value);
}
