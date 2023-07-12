import { useComponent } from '../../provider';
import type { Bridge } from './types';

/**
 * Returns Bridge component instance.
 */
export function useBridge(): Bridge {
  return useComponent('bridge');
}
