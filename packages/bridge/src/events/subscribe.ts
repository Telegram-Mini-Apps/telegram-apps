import { singletonEmitter } from './emitter.js';
import { unsubscribe } from './unsubscribe.js';

import type { GlobalEventListener } from './events.js';

type StopListening = () => void;

/**
 * Subscribes to all events sent from the native Telegram application.
 * Returns function used to remove added event listener.
 * @param listener - event listener.
 */
export function subscribe(listener: GlobalEventListener): StopListening {
  singletonEmitter().subscribe(listener);

  return () => unsubscribe(listener);
}
