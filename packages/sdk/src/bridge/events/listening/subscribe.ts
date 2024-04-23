import type { RemoveEventListenerFn } from '@/events/types.js';

import { miniAppsEventEmitter } from '../event-emitter/singleton.js';
import { unsubscribe } from '../listening/unsubscribe.js';
import type { MiniAppsEventEmitterSubscribeListener } from '../event-emitter/createMiniAppsEventEmitter.js';

/**
 * Subscribes to all events sent from the native Telegram application.
 * @param listener - event listener to bind.
 * @returns Function to remove bound event listener.
 */
export function subscribe(listener: MiniAppsEventEmitterSubscribeListener): RemoveEventListenerFn {
  miniAppsEventEmitter().subscribe(listener);
  return () => unsubscribe(listener);
}
