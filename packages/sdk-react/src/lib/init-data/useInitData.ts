import { useComponent } from '../../provider';
import type { InitData } from './types';

/**
 * Returns InitData component instance.
 */
export function useInitData(): InitData {
  return useComponent('initData');
}
