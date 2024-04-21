import type { MiniAppsEventEmitter } from '@/bridge/events/types/index.js';
import { createSingleton } from '@/misc/createSingleton.js';

import { createEmitter } from './createEmitter.js';

export const [getSingletonEmitter] = createSingleton(createEmitter, (result) => result[1]());

/**
 * Returns Mini Apps event emitter singleton.
 */
export function singletonEmitter(): MiniAppsEventEmitter {
  return getSingletonEmitter()[0];
}
