import {HapticFeedback} from 'twa-sdk';
import {useComponent} from '../../sdk';

/**
 * Returns HapticFeedback component instance.
 */
export function useHapticFeedback(): HapticFeedback {
  return useComponent('haptic');
}