import { useComponent } from '../../provider/index.js';
import type { HapticFeedback } from './types.js';

/**
 * Returns HapticFeedback component instance.
 */
export function useHapticFeedback(): HapticFeedback {
  return useComponent('haptic');
}
