import { retrieve as retrieveLaunchParams } from '@/scopes/launch-params/static.js';

import { raw, state } from './signals.js';

/**
 * Restores the component state.
 */
export function restore(): void {
  const lp = retrieveLaunchParams();
  state.set(lp.initData);
  raw.set(lp.initDataRaw);
}
