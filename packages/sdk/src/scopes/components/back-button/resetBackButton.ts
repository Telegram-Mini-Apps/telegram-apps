import { resetSignal } from '@test-utils/reset.js';

import { isMounted, isVisible } from './back-button.js';

export function resetBackButton() {
  [isVisible, isMounted].forEach(resetSignal);
}