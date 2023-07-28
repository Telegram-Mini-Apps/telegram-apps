import { useUnit } from '../../provider/index.js';
import { useEventsTracking } from '../hooks.js';
import type { MainButton } from './types.js';

/**
 * Returns MainButton component instance.
 */
export function useMainButton(): MainButton {
  const mainButton = useUnit('mainButton');
  useEventsTracking(mainButton, [
    'isEnabledChanged', 'backgroundColorChanged', 'isProgressVisibleChanged',
    'textChanged', 'textColorChanged', 'isVisibleChanged',
  ]);

  return mainButton;
}
