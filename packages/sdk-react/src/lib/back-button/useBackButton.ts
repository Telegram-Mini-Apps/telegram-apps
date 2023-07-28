import { useUnit } from '../../provider/index.js';
import { useEventsTracking } from '../hooks.js';
import type { BackButton } from './types.js';

/**
 * Returns BackButton component instance.
 */
export function useBackButton(): BackButton {
  const backButton = useUnit('backButton');
  useEventsTracking(backButton, ['isVisibleChanged']);

  return backButton;
}
