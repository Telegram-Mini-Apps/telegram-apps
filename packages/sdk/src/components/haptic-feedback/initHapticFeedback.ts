import { createInitFn } from '@/components/utilities/createInitFn/createInitFn.js';

import { HapticFeedback } from './HapticFeedback.js';

/**
 * @returns A new initialized instance of the `HapticFeedback` class.
 * @see HapticFeedback
 */
export const initHapticFeedback = createInitFn<HapticFeedback, 'version'>(
  ({ version, postEvent }) => new HapticFeedback(version, postEvent),
);
