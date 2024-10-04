import { resetSignal } from '@test-utils/reset/reset.js';

import { isMounted, isVerticalEnabled } from '@/scopes/components/swipe-behavior/swipe-behavior.js';

export function resetSwipeBehavior() {
  [isMounted, isVerticalEnabled].forEach(resetSignal);
}