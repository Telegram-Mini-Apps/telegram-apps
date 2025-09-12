import { is } from 'valibot';

import { launchParamsQuery } from '@/generators/launchParamsQuery.js';

/**
 * @returns True if the passed value contains valid launch parameters query.
 */
export function isLaunchParamsQuery(value: string | URLSearchParams): boolean {
  try {
    return is(launchParamsQuery(), value);
  } catch {
    return false;
  }
}