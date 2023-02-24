import {useComponent} from '../../provider';
import {InitData} from './types';

/**
 * Returns InitData component instance.
 */
export function useInitData(): InitData {
  return useComponent('initData');
}