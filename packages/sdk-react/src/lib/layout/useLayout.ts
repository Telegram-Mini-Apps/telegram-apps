import {useComponent} from '../../provider';
import {useEventsTracking} from '../hooks';
import {Layout} from './types';

/**
 * Returns Layout component instance.
 */
export function useLayout(): Layout {
  const layout = useComponent('layout');
  useEventsTracking(layout, ['backgroundColorChanged', 'headerColorChanged']);

  return layout;
}
