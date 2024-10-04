import { resetSignal } from '@test-utils/reset.js';

import { isMounted, isVisible } from './settings-button.js';

export function resetSettingsButton() {
  [isMounted, isVisible].forEach(resetSignal);
}