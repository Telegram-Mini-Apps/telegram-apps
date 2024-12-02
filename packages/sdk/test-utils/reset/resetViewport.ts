import { resetSignal } from '@test-utils/reset/reset.js';

import {
  contentSafeAreaInsets,
  contentSafeAreaInsetTop,
  contentSafeAreaInsetBottom,
  contentSafeAreaInsetLeft,
  contentSafeAreaInsetRight,
} from '@/scopes/components/viewport/signals/content-safe-area-insets.js';
import { isCssVarsBound } from '@/scopes/components/viewport/signals/css-vars.js';
import { height, stableHeight, width } from '@/scopes/components/viewport/signals/dimensions.js';
import { isExpanded, isStable } from '@/scopes/components/viewport/signals/flags.js';
import {
  isMounting,
  mountError,
  mountPromise,
  isMounted,
} from '@/scopes/components/viewport/signals/mounting.js';
import {
  safeAreaInsetBottom,
  safeAreaInsetLeft,
  safeAreaInsetRight,
  safeAreaInsetTop,
  safeAreaInsets,
} from '@/scopes/components/viewport/signals/safe-area-insets.js';
import { state } from '@/scopes/components/viewport/signals/state.js';


export function resetViewport() {
  [
    contentSafeAreaInsets,
    contentSafeAreaInsetTop,
    contentSafeAreaInsetBottom,
    contentSafeAreaInsetLeft,
    contentSafeAreaInsetRight,
    isCssVarsBound,
    height,
    stableHeight,
    width,
    isExpanded,
    isStable,
    isMounting,
    mountError,
    mountPromise,
    isMounted,
    safeAreaInsetBottom,
    safeAreaInsetLeft,
    safeAreaInsetRight,
    safeAreaInsetTop,
    safeAreaInsets,
    state,
  ].forEach(resetSignal);
}