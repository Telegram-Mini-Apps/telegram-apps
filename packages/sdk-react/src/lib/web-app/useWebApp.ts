import { useUnit } from '../../provider/index.js';
import type { WebApp } from './types.js';
import { useEventsTracking } from '../hooks.js';

/**
 * Returns WebApp component instance.
 */
export function useWebApp(): WebApp {
  const webApp = useUnit('webApp');
  useEventsTracking(webApp, ['headerColorChanged', 'backgroundColorChanged']);

  return webApp;
}
