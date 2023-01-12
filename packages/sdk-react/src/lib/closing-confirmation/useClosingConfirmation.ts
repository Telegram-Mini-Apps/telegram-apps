import {ClosingConfirmation} from 'twa-sdk';

import {useComponent} from '../../sdk';
import {useEventsTracking} from '../../hooks';

/**
 * Returns ClosingConfirmation component instance.
 */
export function useClosingConfirmation(): ClosingConfirmation {
  const component = useComponent('closingConfirmation');
  useEventsTracking(component, ['change']);

  return component;
}
