import { useMemo } from 'react';
import { retrieveLaunchParams } from '@tma.js/sdk';

import type { LaunchParams } from './types.js';

/**
 * The hook which returns launch parameters initially passed to Web App.
 */
export function useLaunchParams(): LaunchParams {
  return useMemo(retrieveLaunchParams, []);
}
