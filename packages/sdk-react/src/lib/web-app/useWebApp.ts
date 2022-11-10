import {WebApp} from 'twa-sdk';
import {useComponent} from '../../sdk';
import {useEventsTracking} from '../../hooks';

/**
 * Returns WebApp component instance.
 */
export function useWebApp(): WebApp {
  const webApp = useComponent('webApp');
  useEventsTracking(webApp, [
    'closingConfirmationChange', 'backgroundColorChange', 'headerColorChange',
  ]);

  return webApp;
}