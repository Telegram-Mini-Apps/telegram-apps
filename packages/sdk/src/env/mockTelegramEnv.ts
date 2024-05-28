import { saveToStorage } from '@/launch-params/saveToStorage.js';
import { parseMessage } from '@/bridge/parseMessage.js';
import { isIframe } from '@/env/isIframe.js';
import { hasExternalNotify } from '@/env/hasExternalNotify.js';
import { emitMiniAppsEvent } from '@/bridge/events/event-handlers/emitMiniAppsEvent.js';
import { serializeThemeParams } from '@/components/ThemeParams/parsing/serializeThemeParams.js';
import { parseLaunchParams } from '@/launch-params/parseLaunchParams.js';
import type { LaunchParams } from '@/launch-params/types.js';
import type { MiniAppsEventPayload } from '@/bridge/events/types.js';

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
      const { eventType } = parseMessage(data);

      if (eventType === 'web_app_request_theme') {
        emitMiniAppsEvent('theme_changed', {
          theme_params: JSON.parse(serializeThemeParams(lp.themeParams)),
        } satisfies MiniAppsEventPayload<'theme_changed'>);
      }

      if (eventType === 'web_app_request_viewport') {
        emitMiniAppsEvent('viewport_changed', {
          width: window.innerWidth,
          height: window.innerHeight,
          is_state_stable: true,
          is_expanded: true,
        } satisfies MiniAppsEventPayload<'viewport_changed'>);
      }
    } catch {
    }
  }

  // Override all possible ways of calling a Mini Apps method.
  if (isIframe()) {
    const postMessage = window.parent.postMessage.bind(window.parent);
    window.parent.postMessage = data => {
      void wiredPostMessage(data);
      postMessage(data);
    };
    return;
  }

  if (hasExternalNotify(window)) {
    const notify = window.external.notify.bind(window.external);
    window.external.notify = data => {
      void wiredPostMessage(data);
      notify(data);
    };
    return;
  }

  const proxy = (window as any).TelegramWebviewProxy;
  (window as any).TelegramWebviewProxy = {
    ...(proxy || {}),
    postEvent(...args: any) {
      void wiredPostMessage(JSON.stringify({ eventType: args[0], eventData: args[1] }));
      proxy && proxy.postEvent(...args);
    },
  };
}
