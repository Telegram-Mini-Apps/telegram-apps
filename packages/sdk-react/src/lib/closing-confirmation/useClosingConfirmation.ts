import {ClosingConfirmation} from '@twa.js/sdk';

import {useComponent} from '../../provider';
import {useEventsTracking} from '../hooks';

/**
 * Returns ClosingConfirmation component instance.
 */
export function useClosingConfirmation(): ClosingConfirmation {
  const component = useComponent('closingConfirmation');
  useEventsTracking(component, ['isEnabledChanged']);

  return component;
}
