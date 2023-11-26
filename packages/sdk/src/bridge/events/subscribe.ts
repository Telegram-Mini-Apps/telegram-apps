import type { MiniAppsGlobalEventListener } from './events.js';
import { singletonEmitter } from './singletonEmitter.js';
import { unsubscribe } from './unsubscribe.js';

type StopListening = () => void;

/**
 * Subscribes to all events sent from the native Telegram application.
 * Returns function used to remove added event listener.
 * @param listener - event listener.
 */
export function subscribe(listener: MiniAppsGlobalEventListener): StopListening {
  singletonEmitter().subscribe(listener);
  return () => unsubscribe(listener);
}
