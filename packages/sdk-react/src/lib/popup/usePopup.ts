import {Popup} from 'twa-sdk';

import {useComponent} from '../../sdk';
import {useEventsTracking} from '../../hooks';

/**
 * Returns Popup component instance.
 */
export function usePopup(): Popup {
  const popup = useComponent('popup');
  useEventsTracking(popup, ['openChanged']);

  return popup;
}