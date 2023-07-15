import { useComponent } from '../../provider/index.js';
import { useEventsTracking } from '../hooks.js';
import type { ClosingConfirmation } from './types.js';

/**
 * Returns ClosingConfirmation component instance.
 */
export function useClosingConfirmation(): ClosingConfirmation {
  const component = useComponent('closingConfirmation');
  useEventsTracking(component, ['isEnabledChanged']);

  return component;
}
