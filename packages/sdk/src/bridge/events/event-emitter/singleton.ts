import { createSingleton } from '@/misc/createSingleton.js';

import {
  createMiniAppsEventEmitter,
  type MiniAppsEventEmitter,
} from './createMiniAppsEventEmitter.js';

const [get, disposeMiniAppsEventEmitter] = createSingleton(
  createMiniAppsEventEmitter,
  (result) => result[1](),
);

/**
 * Returns Mini Apps event emitter singleton.
 */
export function miniAppsEventEmitter(): MiniAppsEventEmitter {
  return get()[0];
}

export { disposeMiniAppsEventEmitter };
