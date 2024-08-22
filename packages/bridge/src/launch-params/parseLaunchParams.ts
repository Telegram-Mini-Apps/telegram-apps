import { launchParams, type LaunchParams } from '@telegram-apps/transformers';

/**
 * Parses value as launch parameters.
 * @param value - value to parse.
 */
export function parseLaunchParams(value: unknown): LaunchParams {
  return launchParams()(value);
}
