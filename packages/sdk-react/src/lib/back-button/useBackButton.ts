import {useComponent} from '../../sdk';
import {BackButton} from 'twa-sdk';
import {useEventsTracking} from '../../hooks';

/**
 * Returns BackButton component instance.
 */
export function useBackButton(): BackButton {
  const backButton = useComponent('backButton');
  useEventsTracking(backButton, ['visibleChange']);

  return backButton;
}
