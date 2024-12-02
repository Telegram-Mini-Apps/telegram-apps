import { type Computed, computed } from '@telegram-apps/signals';
import type { SafeAreaInsets } from '@telegram-apps/bridge';

import { signalFromState } from './state.js';

function fromState(key: keyof SafeAreaInsets): Computed<number> {
  return computed(() => contentSafeAreaInsets()[key]);
}

export const contentSafeAreaInsets = signalFromState('contentSafeAreaInsets');
export const contentSafeAreaInsetBottom = fromState('bottom');
export const contentSafeAreaInsetLeft = fromState('left');
export const contentSafeAreaInsetRight = fromState('right');
export const contentSafeAreaInsetTop = fromState('top');