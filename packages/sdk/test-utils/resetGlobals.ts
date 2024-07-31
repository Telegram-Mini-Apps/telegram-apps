import { createRequestId, postEvent, version } from '@/scopes/globals/globals.js';
import { resetMiniAppsEventEmitter } from '@/bridge/events/event-emitter/singleton.js';

/**
 * Resets global dependencies.
 */
export function resetGlobals() {
  postEvent.reset();
  postEvent.unsubAll();
  version.reset();
  version.unsubAll();
  createRequestId.reset();
  createRequestId.unsubAll();
  resetMiniAppsEventEmitter();
}