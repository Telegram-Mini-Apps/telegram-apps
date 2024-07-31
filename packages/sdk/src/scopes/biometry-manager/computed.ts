import { computed } from '@/signals/computed/computed.js';

import * as _ from './private.js';

/**
 * Complete biometry manager state.
 */
export const state = computed(_.state);

/**
 * True if the component is currently mounted.
 */
export const isMounted = computed(_.isMounted);

/**
 * True if the component is currently mounting.
 */
export const isMounting = computed(_.isMounting);

/**
 * Error occurred while mounting the component.
 */
export const mountError = computed(_.mountError);