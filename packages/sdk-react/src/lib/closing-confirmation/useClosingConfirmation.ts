import {useComponent} from '../../provider';
import {useEventsTracking} from '../hooks';
import {ClosingConfirmation} from './types';

/**
 * Returns ClosingConfirmation component instance.
 */
export function useClosingConfirmation(): ClosingConfirmation {
  const component = useComponent('closingConfirmation');
  useEventsTracking(component, ['isEnabledChanged']);

  return component;
}
