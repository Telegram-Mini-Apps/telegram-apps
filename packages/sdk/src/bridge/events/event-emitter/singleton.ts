import { createSingleton } from '@/misc/createSingleton.js';

import { createMiniAppsEventEmitter } from './createMiniAppsEventEmitter.js';
import type { MiniAppsEventEmitter } from '../types.js';

const [get, resetMiniAppsEventEmitter] = createSingleton(
  createMiniAppsEventEmitter,
  ([, cleanup]) => cleanup(),
);

/**
 * Returns Mini Apps event emitter singleton.
 */
export function miniAppsEventEmitter(): MiniAppsEventEmitter {
  return get()[0];
}

export { resetMiniAppsEventEmitter };
