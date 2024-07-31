import { computed } from '@/signals/computed/computed.js';

import * as _ from './private.js';

/**
 * True if vertical swipes are enabled.
 */
export const isVerticalSwipesEnabled = computed(_.isVerticalSwipesEnabled);

/**
 * True if the component is currently mounted.
 */
export const isMounted = computed(_.isMounted);