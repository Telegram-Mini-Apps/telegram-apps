import { useComponent } from '../../provider/index.js';
import type { InitData } from './types.js';

/**
 * Returns InitData component instance.
 */
export function useInitData(): InitData {
  return useComponent('initData');
}
