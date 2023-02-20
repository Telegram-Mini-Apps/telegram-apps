import {InitData} from '@twa.js/sdk';

import {useComponent} from '../../provider';

/**
 * Returns InitData component instance.
 */
export function useInitData(): InitData {
  return useComponent('initData');
}