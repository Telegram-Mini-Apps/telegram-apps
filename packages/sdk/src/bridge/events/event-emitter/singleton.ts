import { createSingleton } from '@/misc/createSingleton.js';

import { createMiniAppsEventEmitter } from './createMiniAppsEventEmitter.js';
import type { MiniAppsEventEmitter } from '../types.js';

const [get, resetMiniAppsEventEmitter] = createSingleton(
  (reset) => {
    const [emitter, cleanup] = createMiniAppsEventEmitter();

    // Rewire "off" method and make it reset singleton if no event listeners left.
    const off = emitter.off.bind(emitter);
    emitter.off = (event, listener) => {
      const { count } = emitter;
      off(event, listener);

      // If event emitter now has no listeners, we can make a cleanup.
      if (count && !emitter.count) {
        reset();
      }
    };

    // Rewire "on" method to make it call "off" method if listener had to be called only once.
    const on = emitter.on.bind(emitter);
    emitter.on = (event, listener, once) => {
      return on(event, function wired(...args) {
        listener(...args);

        if (once) {
          emitter.off(event, wired);
        }
      });
    };

    return [emitter, cleanup] as const;
  },
  ([, cleanup]) => cleanup(),
);

/**
 * Returns Mini Apps event emitter singleton.
 */
export function miniAppsEventEmitter(): MiniAppsEventEmitter {
  return get()[0];
}

export { resetMiniAppsEventEmitter };
