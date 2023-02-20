import {MainButton} from '@twa.js/sdk';

import {useComponent} from '../../provider';
import {useEventsTracking} from '../hooks';

/**
 * Returns MainButton component instance.
 */
export function useMainButton(): MainButton {
  const mainButton = useComponent('mainButton');
  useEventsTracking(mainButton, [
    'isEnabledChanged', 'colorChanged', 'isProgressVisibleChanged', 'textChanged',
    'textColorChanged', 'isVisibleChanged',
  ]);

  return mainButton;
}