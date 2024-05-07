import { initHapticFeedback } from '@tma.js/sdk';

import { createHOC, type HOC } from '../createHOC.js';
import { createHook, type Hook } from '../createHook.js';

/**
 * Hook to receive the HapticFeedback component instance.
 */
export const useHapticFeedback: Hook<typeof initHapticFeedback> = createHook(initHapticFeedback);

/**
 * HOC to pass the HapticFeedback component instance to the wrapped component.
 */
export const withHapticFeedback: HOC<'hapticFeedback', typeof useHapticFeedback> = createHOC('hapticFeedback', useHapticFeedback);
