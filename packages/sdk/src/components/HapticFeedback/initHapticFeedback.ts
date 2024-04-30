import { createComponentInitFn } from '@/init/createComponentInitFn/createComponentInitFn.js';

import { HapticFeedback } from './HapticFeedback.js';

/**
 * @returns A new initialized instance of the `HapticFeedback` class.
 * @see HapticFeedback
 */
export const initHapticFeedback = createComponentInitFn<HapticFeedback, 'version'>(
  ({ version, postEvent }) => new HapticFeedback(version, postEvent),
);
