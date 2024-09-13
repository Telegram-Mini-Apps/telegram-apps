import { LaunchParams } from '@telegram-apps/sdk';

/**
 * @returns The application launch parameters.
 */
export function useLaunchParams(): LaunchParams.LaunchParams {
  return LaunchParams.retrieve();
}