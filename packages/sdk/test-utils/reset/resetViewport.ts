import { resetSignal } from '@test-utils/reset/reset.js';

import {
  state,
  mountError,
  isMounted,
  isCssVarsBound,
  isMounting,
  width,
  isExpanded,
  height,
  stableHeight,
  isStable,
} from '@/scopes/components/viewport/signals.js';

export function resetViewport() {
  [
    state,
    mountError,
    isMounted,
    isCssVarsBound,
    isMounting,
    width,
    isExpanded,
    height,
    stableHeight,
    isStable,
  ].forEach(resetSignal);
}