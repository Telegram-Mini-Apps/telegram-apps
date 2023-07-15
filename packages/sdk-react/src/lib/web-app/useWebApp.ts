import { useComponent } from '../../provider/index.js';
import type { WebApp } from './types.js';

/**
 * Returns WebApp component instance.
 */
export function useWebApp(): WebApp {
  return useComponent('webApp');
}
