import { resetSignal } from '@test-utils/reset/reset.js';

import { isMounted, isVisible } from '@/scopes/components/settings-button/settings-button.js';

export function resetSettingsButton() {
  [isMounted, isVisible].forEach(resetSignal);
}