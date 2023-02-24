import {useComponent} from '../../provider';
import {useEventsTracking} from '../hooks';
import {Viewport} from './types';

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