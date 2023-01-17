import {InitData} from '@twa.js/sdk';

import {useComponent} from '../../sdk';

/**
 * Returns InitData component instance.
 */
export function useInitData(): InitData {
  return useComponent('initData');
}