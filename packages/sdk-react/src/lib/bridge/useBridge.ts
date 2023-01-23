import {Bridge} from '@twa.js/bridge';

import {useComponent} from '../../sdk';

/**
 * Returns Bridge component instance.
 */
export function useBridge(): Bridge {
  return useComponent('bridge');
}