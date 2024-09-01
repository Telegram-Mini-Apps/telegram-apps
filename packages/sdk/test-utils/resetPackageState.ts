import { resetPackageState as resetBridgeState } from '@telegram-apps/bridge';
import type { Signal } from '@telegram-apps/signals';

import { $createRequestId, $postEvent, $version } from '@/scopes/globals/globals.js';

export function destroyAndReset(s: Signal<any>) {
  s.destroy();
  s.reset();
}

export function resetPackageState() {
  resetBridgeState();
  [$postEvent, $version, $createRequestId].forEach(destroyAndReset);
}