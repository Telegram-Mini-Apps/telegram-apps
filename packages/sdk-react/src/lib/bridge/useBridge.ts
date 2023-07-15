import { useComponent } from '../../provider/index.js';
import type { Bridge } from './types.js';

/**
 * Returns Bridge component instance.
 */
export function useBridge(): Bridge {
  return useComponent('bridge');
}
