import { computed } from '@/signals/computed/computed.js';

import * as _ from './private.js';

/**
 * True if the confirmation dialog should be shown while the user is trying to close the Mini App.
 */
export const isConfirmationNeeded = computed(_.isConfirmationNeeded);

/**
 * True if the component is currently mounted.
 */
export const isMounted = computed(_.isMounted);