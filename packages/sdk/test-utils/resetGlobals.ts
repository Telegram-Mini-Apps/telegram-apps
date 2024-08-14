import { resetMiniAppsEventEmitter } from '@telegram-apps/bridge';

import { $createRequestId, $postEvent, $version } from '@/scopes/globals/globals.js';

/**
 * Resets global dependencies.
 */
export function resetGlobals() {
  $postEvent.reset();
  $postEvent.unsubAll();
  $version.reset();
  $version.unsubAll();
  $createRequestId.reset();
  $createRequestId.unsubAll();
  resetMiniAppsEventEmitter();
}