import { resetSignal } from '@test-utils/reset.js';

import { isMounted, isVerticalEnabled } from './swipe-behavior.js';

export function resetSwipeBehavior() {
  [isMounted, isVerticalEnabled].forEach(resetSignal);
}