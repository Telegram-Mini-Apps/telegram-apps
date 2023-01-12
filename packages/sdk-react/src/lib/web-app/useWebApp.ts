import {WebApp} from 'twa-sdk';

import {useComponent} from '../../sdk';

/**
 * Returns WebApp component instance.
 */
export function useWebApp(): WebApp {
  return useComponent('webApp');
}