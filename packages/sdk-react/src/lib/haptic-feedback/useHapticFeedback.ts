import {HapticFeedback} from '@twa.js/sdk';

import {useComponent} from '../../provider';

/**
 * Returns HapticFeedback component instance.
 */
export function useHapticFeedback(): HapticFeedback {
  return useComponent('haptic');
}