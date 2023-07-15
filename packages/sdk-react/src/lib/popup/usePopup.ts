import { useComponent } from '../../provider/index.js';
import { useEventsTracking } from '../hooks.js';
import type { Popup } from './types.js';

/**
 * Returns Popup component instance.
 */
export function usePopup(): Popup {
  const popup = useComponent('popup');
  useEventsTracking(popup, ['isOpenedChanged']);

  return popup;
}
