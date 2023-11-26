import { type LaunchParams, retrieveLaunchData } from '@tma.js/sdk';

/**
 * Hooks to retrieve launch parameters.
 */
export function useLaunchParams(): LaunchParams {
  return retrieveLaunchData().launchParams;
}
