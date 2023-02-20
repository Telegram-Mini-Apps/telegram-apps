import {Layout} from '@twa.js/sdk';

import {useComponent} from '../../provider';
import {useEventsTracking} from '../hooks';

/**
 * Returns Layout component instance.
 */
export function useLayout(): Layout {
  const layout = useComponent('layout');
  useEventsTracking(layout, ['backgroundColorChanged', 'headerColorChanged']);

  return layout;
}
