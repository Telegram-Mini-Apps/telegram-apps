import { resetPackageState as resetBridgeState } from '@telegram-apps/bridge';
import type { Computed, Signal } from '@telegram-apps/signals';

import { $createRequestId, $postEvent, $version } from '@/scopes/globals.js';
import { resetBackButton } from '@test-utils/reset/resetBackButton.js';
import { resetBiometry } from '@test-utils/reset/resetBiometry.js';
import { resetClosingBehavior } from '@test-utils/reset/resetClosingBehavior.js';
import { resetInitData } from '@test-utils/reset/resetInitData.js';
import { resetInvoice } from '@test-utils/reset/resetInvoice.js';
import { resetMainButton } from '@test-utils/reset/resetMainButton.js';
import { resetMiniApp } from '@test-utils/reset/resetMiniApp.js';
import { resetPopup } from '@test-utils/reset/resetPopup.js';
import { resetQrScanner } from '@test-utils/reset/resetQrScanner.js';
import { resetSecondaryButton } from '@test-utils/reset/resetSecondaryButton.js';
import { resetSettingsButton } from '@test-utils/reset/resetSettingsButton.js';
import { resetSwipeBehavior } from '@test-utils/reset/resetSwipeBehavior.js';
import { resetThemeParams } from '@test-utils/reset/resetThemeParams.js';
import { resetViewport } from '@test-utils/reset/resetViewport.js';
import { resetPrivacy } from '@test-utils/reset/resetPrivacy.js';
import {resetFullScreen} from "@test-utils/reset/resetFullScreen.js";

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
    resetFullScreen,
    resetInitData,
    resetInvoice,
    resetMainButton,
    resetMiniApp,
    resetPopup,
    resetPrivacy,
    resetQrScanner,
    resetSecondaryButton,
    resetSettingsButton,
    resetSwipeBehavior,
    resetThemeParams,
    resetViewport,
  ].forEach(reset => reset());
  [$postEvent, $version, $createRequestId].forEach(resetSignal);
}
