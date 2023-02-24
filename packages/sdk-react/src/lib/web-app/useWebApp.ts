import {useComponent} from '../../provider';
import {WebApp} from './types';

/**
 * Returns WebApp component instance.
 */
export function useWebApp(): WebApp {
  return useComponent('webApp');
}