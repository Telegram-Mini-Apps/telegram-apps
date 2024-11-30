import { resetSignal } from '@test-utils/reset/reset.js';

import { isFullScreen, isMounted } from '@/scopes/components/full-screen/full-screen.js';

export function resetFullScreen() {
  [isMounted, isFullScreen].forEach(resetSignal);
}