import { retrieveLaunchParams } from '@telegram-apps/bridge';

import { raw, state } from './signals.js';

/**
 * Restores the component state.
 */
export function restore(): void {
  const lp = retrieveLaunchParams();
  state.set(lp.initData);
  raw.set(lp.initDataRaw);
}
