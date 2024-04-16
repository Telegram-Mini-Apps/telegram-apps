import { singletonEmitter } from './singletonEmitter.js';
import type { MiniAppsGlobalEventListener } from './types/events.js';
import type { CleanupFn } from './types/misc.js';
import { unsubscribe } from './unsubscribe.js';

/**
 * Subscribes to all events sent from the native Telegram application.
 * Returns function used to remove added event listener.
 * @param listener - event listener.
 */
export function subscribe(listener: MiniAppsGlobalEventListener): CleanupFn {
  singletonEmitter().subscribe(listener);
  return () => unsubscribe(listener);
}
