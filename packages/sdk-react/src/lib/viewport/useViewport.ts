import { useUnit } from '../../provider/index.js';
import { useEventsTracking } from '../hooks.js';
import type { Viewport } from './types.js';

/**
 * Returns Viewport component instance.
 */
export function useViewport(): Viewport {
  const viewport = useUnit('viewport');
  useEventsTracking(viewport, [
    'stableHeightChanged', 'isExpandedChanged', 'heightChanged', 'widthChanged',
  ]);

  return viewport;
}
