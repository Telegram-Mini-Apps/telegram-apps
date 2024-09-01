import { resetPackageState as resetBridgeState } from '@telegram-apps/bridge';
import type { Signal } from '@telegram-apps/signals';

import { $createRequestId, $postEvent, $version } from '@/scopes/globals/globals.js';

export function resetSignal(s: Signal<any>) {
  s.unsubAll();
  s.reset();
}

export function resetPackageState() {
  resetBridgeState();
  [$postEvent, $version, $createRequestId].forEach(resetSignal);
}
