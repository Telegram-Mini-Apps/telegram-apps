import {useComponent} from '../../provider';
import {HapticFeedback} from './types';

/**
 * Returns HapticFeedback component instance.
 */
export function useHapticFeedback(): HapticFeedback {
  return useComponent('haptic');
}