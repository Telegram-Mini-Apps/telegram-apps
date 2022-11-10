import {Bridge} from 'twa-bridge';
import {useComponent} from '../../sdk';

/**
 * Returns Bridge component instance.
 */
export function useBridge(): Bridge {
  return useComponent('bridge');
}