import { createInitFn } from '@/components/createInitFn.js';
import { HapticFeedback } from '@/components/haptic-feedback/HapticFeedback.js';

/**
 * @returns A new initialized instance of HapticFeedback class.
 */
export const initHapticFeedback = createInitFn(
  ({ version, postEvent }) => new HapticFeedback(version, postEvent),
);
