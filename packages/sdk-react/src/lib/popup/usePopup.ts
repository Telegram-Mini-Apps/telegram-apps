import { useUnit } from '../../provider/index.js';
import { useEventsTracking } from '../hooks.js';
import type { Popup } from './types.js';

/**
 * Returns Popup component instance.
 */
export function usePopup(): Popup {
  const popup = useUnit('popup');
  useEventsTracking(popup, ['isOpenedChanged']);

  return popup;
}
