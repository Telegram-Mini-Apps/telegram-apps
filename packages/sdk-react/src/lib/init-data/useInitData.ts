import {InitData} from 'twa-sdk';

import {useComponent} from '../../sdk';

/**
 * Returns InitData component instance.
 */
export function useInitData(): InitData {
  return useComponent('initData');
}