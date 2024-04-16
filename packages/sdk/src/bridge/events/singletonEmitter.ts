import { createEmitter } from './createEmitter.js';
import type { MiniAppsEventEmitter } from './types/events.js';

const CACHED_EMITTER = '@tma.js/cached-emitter';

/**
 * Returns singleton instance of bridge EventEmitter. Also, defines
 * Telegram event handlers.
 */
export function singletonEmitter(): MiniAppsEventEmitter {
  const wnd: any = window;
  const cachedEmitter = wnd[CACHED_EMITTER];

  if (cachedEmitter === undefined) {
    wnd[CACHED_EMITTER] = createEmitter();
  }

  return wnd[CACHED_EMITTER];
}
