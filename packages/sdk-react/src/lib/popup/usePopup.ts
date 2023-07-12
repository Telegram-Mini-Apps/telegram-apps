import { useComponent } from '../../provider';
import { useEventsTracking } from '../hooks';
import type { Popup } from './types';

/**
 * Returns Popup component instance.
 */
export function usePopup(): Popup {
  const popup = useComponent('popup');
  useEventsTracking(popup, ['isOpenedChanged']);

  return popup;
}
