import { resetSignal } from '@test-utils/reset.js';

import { isMounted, isConfirmationEnabled } from './closing-behavior.js';

export function resetClosingBehavior() {
  [isMounted, isConfirmationEnabled].forEach(resetSignal);
}