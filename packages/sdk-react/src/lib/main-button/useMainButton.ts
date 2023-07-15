import { useComponent } from '../../provider/index.js';
import { useEventsTracking } from '../hooks.js';
import type { MainButton } from './types.js';

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
