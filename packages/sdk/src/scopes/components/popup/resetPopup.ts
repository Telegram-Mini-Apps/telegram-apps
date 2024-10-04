import { resetSignal } from '@test-utils/reset.js';

import { isOpened } from './popup.js';

export function resetPopup() {
  [isOpened].forEach(resetSignal);
}