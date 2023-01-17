import {WebApp} from '@twa.js/sdk';

import {useComponent} from '../../sdk';

/**
 * Returns WebApp component instance.
 */
export function useWebApp(): WebApp {
  return useComponent('webApp');
}