import {Bridge} from '@twa.js/bridge';

import {useComponent} from '../../provider';

/**
 * Returns Bridge component instance.
 */
export function useBridge(): Bridge {
  return useComponent('bridge');
}