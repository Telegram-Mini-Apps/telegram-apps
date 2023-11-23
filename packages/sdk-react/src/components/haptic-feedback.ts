import { createHoc } from '../createHoc.js';
import { createHook } from '../createHook.js';

/**
 * Hook to retrieve HapticFeedback component.
 */
export const useHapticFeedback = createHook('hapticFeedback');

/**
 * HOC to wrap specified component to pass HapticFeedback instance.
 */
export const withHapticFeedback = createHoc('hapticFeedback', useHapticFeedback);
