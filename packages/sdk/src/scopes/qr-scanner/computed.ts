import { computed } from '@/signals/computed/computed.js';

import * as _ from './private.js';

/**
 * True if the scanner is currently opened.
 */
export const isOpened = computed(_.isOpened);