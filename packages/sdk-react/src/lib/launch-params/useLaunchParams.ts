import { useMemo } from 'react';
import { computeLaunchData } from '@tma.js/launch-params';

import type { LaunchParams } from './types.js';

/**
 * The hook which returns launch parameters initially passed to Mini App.
 */
export function useLaunchParams(): LaunchParams {
  return useMemo(() => computeLaunchData().launchParams, []);
}
