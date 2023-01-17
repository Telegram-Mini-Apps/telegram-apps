import {HapticFeedback} from '@twa.js/sdk';

import {useComponent} from '../../sdk';

/**
 * Returns HapticFeedback component instance.
 */
export function useHapticFeedback(): HapticFeedback {
  return useComponent('haptic');
}