import { useComponent } from '../../provider/index.js';
import type { InitData } from './types.js';

/**
 * Returns InitData component instance.
 */
export function useInitData(): InitData | null {
  return useComponent('initData') || null;
}
