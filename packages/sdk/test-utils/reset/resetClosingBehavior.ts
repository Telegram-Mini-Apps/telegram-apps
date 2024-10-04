import { resetSignal } from '@test-utils/reset/reset.js';

import { isMounted, isConfirmationEnabled } from '@/scopes/components/closing-behavior/closing-behavior.js';

export function resetClosingBehavior() {
  [isMounted, isConfirmationEnabled].forEach(resetSignal);
}