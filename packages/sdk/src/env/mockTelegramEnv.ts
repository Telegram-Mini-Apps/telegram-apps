import { emitMiniAppsEvent, type EventPayload, type LaunchParams } from '@telegram-apps/bridge';
import { object, string } from '@telegram-apps/transform';

import { saveToStorage } from '@/scopes/launch-params/saveToStorage.js';
import { serialize } from '@/scopes/theme-params/static.js';
import { parseLaunchParams } from '@/scopes/launch-params/parseLaunchParams.js';
import { debugLog } from '@/utils/debug.js';

// TODO: Allow custom methods call handling.

/**
 * Mocks a Telegram application environment.
 * @param launchParamsRaw - launch parameters presented as a string or query parameters.
 */
export function mockTelegramEnv(launchParamsRaw: LaunchParams | string): void {
  const lp = typeof launchParamsRaw === 'string'
    ? parseLaunchParams(launchParamsRaw)
    : launchParamsRaw;

  // Save launch params in the storage, so retrieveLaunchParams will return them.
  saveToStorage(lp);

  function wiredPostMessage(data: unknown): void {
    if (typeof data !== 'string') {
      return;
    }
    try {
      const { eventType } = object({
        eventType: string(),
        eventData: (v) => v,
      })()(data);

      if (eventType === 'web_app_request_theme') {
        emitMiniAppsEvent('theme_changed', {
          theme_params: JSON.parse(serialize(lp.themeParams)),
        } satisfies EventPayload<'theme_changed'>);
      }

      if (eventType === 'web_app_request_viewport') {
        emitMiniAppsEvent('viewport_changed', {
          width: window.innerWidth,
          height: window.innerHeight,
          is_state_stable: true,
          is_expanded: true,
        } satisfies EventPayload<'viewport_changed'>);
      }
    } catch {
    }
  }

  // Override all possible ways of calling a Mini Apps method.

  // Wire for iframe.
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const postMessage = window.parent.postMessage;
  window.parent.postMessage = (...args) => {
    void wiredPostMessage(args[0]);
    postMessage.apply(window.parent, args as any);
  };
  debugLog('window.parent.postMessage was mocked via mockTelegramEnv');

  // Wire for other platforms.
  (window as any).TelegramWebviewProxy = {
    postEvent(eventType: string, eventData: string) {
      wiredPostMessage(JSON.stringify({ eventType, eventData }));
    },
  };
}
