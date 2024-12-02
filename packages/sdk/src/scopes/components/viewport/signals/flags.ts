import { computed } from '@telegram-apps/signals';

import { signalFromState } from './state.js';
import { height, stableHeight } from './dimensions.js';

/**
 * Signal indicating if the Mini App is expanded to the maximum available height. Otherwise,
 * if the Mini App occupies part of the screen and can be expanded to the full
 * height using `expand` method.
 * @see expand
 */
export const isExpanded = signalFromState('isExpanded');

/**
 * Signal indicating if the current viewport height is stable and is not going to change in
 * the next moment.
 */
export const isStable = computed(() => height() === stableHeight());