import { computed } from '@/signals/computed/computed.js';

import * as _ from './private.js';

/**
 * True if the component is currently visible.
 */
export const isVisible = computed(_.isVisible);

/**
 * True if the component is currently mounted.
 */
export const isMounted = computed(_.isMounted);