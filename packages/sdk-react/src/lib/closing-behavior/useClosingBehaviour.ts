import { useUnit } from '../../provider/index.js';
import { useEventsTracking } from '../hooks.js';
import type { ClosingBehaviour } from './types.js';

/**
 * Returns ClosingBehaviour component instance.
 */
export function useClosingBehaviour(): ClosingBehaviour {
  const component = useUnit('closingBehavior');
  useEventsTracking(component, ['isConfirmationNeededChanged']);

  return component;
}
