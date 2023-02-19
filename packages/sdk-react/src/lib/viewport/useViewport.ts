import {Viewport} from '@twa.js/sdk';

import {useComponent} from '../../sdk';
import {useEventsTracking} from '../../hooks';

/**
 * Returns Viewport component instance.
 */
export function useViewport(): Viewport {
  const viewport = useComponent('viewport');
  useEventsTracking(viewport, [
    'stableHeightChanged', 'isExpandedChanged', 'heightChanged', 'widthChanged',
  ]);

  return viewport;
}