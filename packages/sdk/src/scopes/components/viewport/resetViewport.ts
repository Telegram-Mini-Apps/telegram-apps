import { resetSignal } from '@test-utils/reset.js';

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
} from './signals.js';

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