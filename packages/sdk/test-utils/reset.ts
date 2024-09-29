import { resetPackageState as resetBridgeState } from '@telegram-apps/bridge';
import type { Computed, Signal } from '@telegram-apps/signals';

import { $createRequestId, $postEvent, $version } from '@/scopes/globals.js';

export function resetSignal(s: Signal<any> | Computed<any>) {
  s.unsubAll();
  'reset' in s && s.reset();
}

export function resetPackageState() {
  resetBridgeState();
  [$postEvent, $version, $createRequestId].forEach(resetSignal);
}
