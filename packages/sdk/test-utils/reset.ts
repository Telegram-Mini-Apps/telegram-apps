import { resetPackageState as resetBridgeState } from '@telegram-apps/bridge';
import type { Computed, Signal } from '@telegram-apps/signals';

import { $createRequestId, $postEvent, $version } from '@/scopes/globals.js';
import { resetBackButton } from '@/scopes/components/back-button/resetBackButton.js';
import { resetBiometry } from '@/scopes/components/biometry/resetBiometry.js';
import { resetClosingBehavior } from '@/scopes/components/closing-behavior/resetClosingBehavior.js';
import { resetInitData } from '@/scopes/components/init-data/resetInitData.js';
import { resetInvoice } from '@/scopes/components/invoice/resetInvoice.js';
import { resetMainButton } from '@/scopes/components/main-button/resetMainButton.js';
import { resetMiniApp } from '@/scopes/components/mini-app/resetMiniApp.js';
import { resetPopup } from '@/scopes/components/popup/resetPopup.js';
import { resetQrScanner } from '@/scopes/components/qr-scanner/resetQrScanner.js';
import { resetSecondaryButton } from '@/scopes/components/secondary-button/resetSecondaryButton.js';
import { resetSettingsButton } from '@/scopes/components/settings-button/resetSettingsButton.js';
import { resetSwipeBehavior } from '@/scopes/components/swipe-behavior/resetSwipeBehavior.js';
import { resetThemeParams } from '@/scopes/components/theme-params/resetThemeParams.js';
import { resetViewport } from '@/scopes/components/viewport/resetViewport.js';

export function resetSignal(s: Signal<any> | Computed<any>) {
  s.unsubAll();
  'reset' in s && s.reset();
}

export function resetPackageState() {
  [
    resetBridgeState,
    resetBackButton,
    resetBiometry,
    resetClosingBehavior,
    resetInitData,
    resetInvoice,
    resetMainButton,
    resetMiniApp,
    resetPopup,
    resetQrScanner,
    resetSecondaryButton,
    resetSettingsButton,
    resetSwipeBehavior,
    resetThemeParams,
    resetViewport,
  ].forEach(reset => reset());
  [$postEvent, $version, $createRequestId].forEach(resetSignal);
}
