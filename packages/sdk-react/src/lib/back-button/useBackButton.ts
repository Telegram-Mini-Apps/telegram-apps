import {useComponent} from '../../provider';
import {useEventsTracking} from '../hooks';
import {BackButton} from './types';

/**
 * Returns BackButton component instance.
 */
export function useBackButton(): BackButton {
  const backButton = useComponent('backButton');
  useEventsTracking(backButton, ['isVisibleChanged']);

  return backButton;
}
