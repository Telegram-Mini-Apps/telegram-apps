import { resetPackageState as resetBridgeState } from '@telegram-apps/bridge';

import { resetSignals } from '@/signals-registry.js';

export function resetPackageState() {
  [resetBridgeState, resetSignals].forEach(reset => reset());
}
