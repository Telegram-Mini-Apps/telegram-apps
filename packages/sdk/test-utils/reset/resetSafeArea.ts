import { resetSignal } from '@test-utils/reset/reset.js';

import {
  state,
  mountError,
  isMounted,
  isCssVarsBound,
  isMounting,
  inset,
  contentInset,
} from '@/scopes/components/safe-area/signals.js';

export function resetSafeArea() {
  [
    state,
    mountError,
    isMounted,
    isCssVarsBound,
    isMounting,
    inset,
    contentInset,
  ].forEach(resetSignal);
}