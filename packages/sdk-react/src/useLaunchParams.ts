import { useMemo } from 'react';
import { LaunchParams } from '@telegram-apps/sdk';

/**
 * Retrieve Mini Apps launch parameters.
 */
export function useLaunchParams(): LaunchParams.LaunchParams {
  return useMemo(LaunchParams.retrieve, []);
}
