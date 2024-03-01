import { type LaunchParams, retrieveLaunchParams } from '@tma.js/sdk';

/**
 * Hook to retrieve launch parameters.
 */
export function useLaunchParams(): LaunchParams {
  return retrieveLaunchParams();
}
