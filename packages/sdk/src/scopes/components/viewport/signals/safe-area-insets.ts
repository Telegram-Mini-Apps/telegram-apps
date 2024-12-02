import { type Computed, computed } from '@telegram-apps/signals';
import type { SafeAreaInsets } from '@telegram-apps/bridge';

import { signalFromState } from './state.js';

function fromState(key: keyof SafeAreaInsets): Computed<number> {
  return computed(() => safeAreaInsets()[key]);
}

export const safeAreaInsets = signalFromState('safeAreaInsets');
export const safeAreaInsetBottom = fromState('bottom');
export const safeAreaInsetLeft = fromState('left');
export const safeAreaInsetRight = fromState('right');
export const safeAreaInsetTop = fromState('top');