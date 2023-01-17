import {BackButton} from '@twa.js/sdk';

import {useComponent} from '../../sdk';
import {useEventsTracking} from '../../hooks';

/**
 * Returns BackButton component instance.
 */
export function useBackButton(): BackButton {
  const backButton = useComponent('backButton');
  useEventsTracking(backButton, ['visibleChanged']);

  return backButton;
}
