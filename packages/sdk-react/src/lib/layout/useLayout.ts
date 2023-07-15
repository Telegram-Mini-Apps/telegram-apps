import { useComponent } from '../../provider/index.js';
import { useEventsTracking } from '../hooks.js';
import type { Layout } from './types.js';

/**
 * Returns Layout component instance.
 */
export function useLayout(): Layout {
  const layout = useComponent('layout');
  useEventsTracking(layout, ['backgroundColorChanged', 'headerColorChanged']);

  return layout;
}
