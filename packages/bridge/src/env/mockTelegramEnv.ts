import {
  miniAppsMessage,
  serializeThemeParams,
  type ThemeParams,
} from '@telegram-apps/transformers';
import type { LaunchParams } from '@telegram-apps/types';

import { parseLaunchParams } from '@/launch-params/parseLaunchParams.js';
import { saveToStorage } from '@/launch-params/storage.js';
import { logInfo } from '@/debug.js';
import { emitMiniAppsEvent } from '@/events/emitMiniAppsEvent.js';
import type { EventPayload } from '@/events/types/index.js';

/**
 * Intercepts the window.parent.postMessage call and performs pre-defined actions. For example,
 * it may handle the request theme request and emit the theme_changed event.
 * @param tp - theme params.
 * @param data - postMessage data.
 */
function imitatePostEvent(tp: ThemeParams, data: unknown): void {
  if (typeof data !== 'string') {
    return;
  }
  try {
    const { eventType } = miniAppsMessage()(data);

    if (eventType === 'web_app_request_theme') {
      emitMiniAppsEvent('theme_changed', {
        theme_params: JSON.parse(serializeThemeParams(tp)),
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

  // Define a special port, expected by the postEvent function.
  const proxyPostEvent = (window as any).TelegramWebviewProxy?.postEvent;
  (window as any).TelegramWebviewProxy = {
    postEvent(eventType: string, eventData: string) {
      imitatePostEvent(lp.themeParams, JSON.stringify({ eventType, eventData }));
      proxyPostEvent?.(eventType, eventData);
    },
  };

  logInfo('Environment was mocked by the mockTelegramEnv function');
}