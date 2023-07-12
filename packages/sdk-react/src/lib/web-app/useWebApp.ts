import { useComponent } from '../../provider';
import type { WebApp } from './types';

/**
 * Returns WebApp component instance.
 */
export function useWebApp(): WebApp {
  return useComponent('webApp');
}
