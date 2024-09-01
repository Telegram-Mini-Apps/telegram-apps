import { retrieve } from '@/scopes/launch-params/static.js';

import { state } from './signals.js';

/**
 * Restores the component state.
 */
export function restore(): void {
  state.set(retrieve().initData);
}
