import type { RemoveEventListenerFn } from '@/events/types.js';

import { miniAppsEventEmitter } from '../event-emitter/singleton.js';
import { unsubscribe } from '../listening/unsubscribe.js';
import type { MiniAppsSubscribeListener } from '../types.js';

/**
 * Subscribes to all events sent from the native Telegram application.
 * @param listener - event listener to bind.
 * @returns Function to remove bound event listener.
 */
export function subscribe(listener: MiniAppsSubscribeListener): RemoveEventListenerFn {
  miniAppsEventEmitter().subscribe(listener);
  return () => unsubscribe(listener);
}
