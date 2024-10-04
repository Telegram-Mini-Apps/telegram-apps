import { resetSignal } from '@test-utils/reset/reset.js';

import { isOpened } from '@/scopes/components/popup/popup.js';

export function resetPopup() {
  [isOpened].forEach(resetSignal);
}