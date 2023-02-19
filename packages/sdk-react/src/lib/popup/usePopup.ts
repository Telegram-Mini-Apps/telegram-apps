import {Popup} from '@twa.js/sdk';

import {useComponent} from '../../sdk';
import {useEventsTracking} from '../../hooks';

/**
 * Returns Popup component instance.
 */
export function usePopup(): Popup {
  const popup = useComponent('popup');
  useEventsTracking(popup, ['isOpenedChanged']);

  return popup;
}