import { createEmitter } from './createEmitter.js';
import type { MiniAppsEventEmitter } from './events.js';

const CACHED_EMITTER = 'telegram-mini-apps-cached-emitter';

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
