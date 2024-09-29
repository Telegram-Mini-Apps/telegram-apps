import { useMemo } from 'react';
import { retrieveLaunchParams, type LaunchParams } from '@telegram-apps/sdk';

/**
 * Retrieves Mini Apps launch parameters.
 */
export function useLaunchParams(): LaunchParams {
  return useMemo(retrieveLaunchParams, []);
}
