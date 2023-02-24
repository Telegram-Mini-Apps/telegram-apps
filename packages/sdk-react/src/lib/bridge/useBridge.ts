import {useComponent} from '../../provider';
import {Bridge} from './types';

/**
 * Returns Bridge component instance.
 */
export function useBridge(): Bridge {
  return useComponent('bridge');
}