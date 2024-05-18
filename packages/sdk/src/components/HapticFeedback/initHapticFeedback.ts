import { createComponentInitFn } from '@/misc/createComponentInitFn/createComponentInitFn.js';

import { HapticFeedback } from './HapticFeedback.js';

/**
 * @returns A new initialized instance of the `HapticFeedback` class.
 * @see HapticFeedback
 */
export const initHapticFeedback = createComponentInitFn(
  ({ version, postEvent }) => new HapticFeedback(version, postEvent),
);
