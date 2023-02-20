import {WebApp} from '@twa.js/sdk';

import {useComponent} from '../../provider';

/**
 * Returns WebApp component instance.
 */
export function useWebApp(): WebApp {
  return useComponent('webApp');
}