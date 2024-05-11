import { useMemo } from 'react';
import { type LaunchParams, retrieveLaunchParams } from '@tma.js/sdk';

/**
 * @returns Launch parameters.
 */
export function useLaunchParams(): LaunchParams {
  return useMemo(retrieveLaunchParams, []);
}