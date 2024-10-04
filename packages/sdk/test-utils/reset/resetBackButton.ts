import { resetSignal } from '@test-utils/reset/reset.js';

import { isMounted, isVisible } from '@/scopes/components/back-button/back-button.js';

export function resetBackButton() {
  [isVisible, isMounted].forEach(resetSignal);
}