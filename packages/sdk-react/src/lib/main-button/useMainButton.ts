import {MainButton} from 'twa-sdk';

import {useComponent} from '../../sdk';
import {useEventsTracking} from '../../hooks';

/**
 * Returns MainButton component instance.
 */
export function useMainButton(): MainButton {
  const mainButton = useComponent('mainButton');
  useEventsTracking(mainButton, [
    'activeChanged', 'colorChanged', 'progressVisibleChanged', 'textChanged',
    'textColorChanged', 'visibleChanged',
  ]);

  return mainButton;
}