import {useComponent} from '../../provider';
import {useEventsTracking} from '../hooks';
import {MainButton} from './types';

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