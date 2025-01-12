import { is, parse, pipe, string, transform } from 'valibot';
import type { LaunchParams } from '@telegram-apps/types';
import { type LaunchParamsShape, MiniAppsMessage } from '@telegram-apps/transformers';
import type { If, IsNever } from '@telegram-apps/toolkit';

import { parseLaunchParams } from '@/launch-params/parseLaunchParams.js';
import { saveToStorage } from '@/launch-params/storage.js';
import { logInfo } from '@/debug.js';
import { isIframe } from '@/env/isIframe.js';
import type { MethodName, MethodParams } from '@/methods/types/index.js';

/**
 * Mocks the environment and imitates Telegram Mini Apps behavior.
 */
export function mockTelegramEnv({ launchParams, onEvent }: {
  /**
   * Launch parameters to mock. They will be saved in the session storage making
   * the `retrieveLaunchParams` function return them.
   */
  launchParams?: LaunchParamsShape | LaunchParams | string | URLSearchParams;
  /**
   * Function that will be called if a Mini Apps method call was requested by the mini app.
   * @param event - event information.
   * @param next - function to call the originally wrapped function (window.parent.postMessage
   * or window.TelegramWebviewProxy.postEvent).
   */
  onEvent?: (
    event: {
      [M in MethodName]: [M, If<IsNever<MethodParams<M>>, void, MethodParams<M>>]
    }[MethodName] | [string, unknown],
    next: () => void,
  ) => void;
} = {}): void {
  // If launch parameters were passed, save them in the session storage, so
  // the retrieveLaunchParams function would return them.
  launchParams && saveToStorage(
    typeof launchParams === 'string' || launchParams instanceof URLSearchParams
      ? parseLaunchParams(launchParams)
      : launchParams,
  );

  // Original postEvent firstly checks if the current environment is iframe.
  // That's why we have a separate branch for this environment here too.
  if (isIframe()) {
    const MiniAppsMessageJson = pipe(string(), transform(JSON.parse), MiniAppsMessage);

    // As long as postEvent uses window.parent.postMessage, we should rewire it.
    const postMessage = window.parent.postMessage.bind(window.parent);
    window.parent.postMessage = (...args) => {
      const [message] = args;
      const next = () => {
        (postMessage as any)(...args);
      };

      if (is(MiniAppsMessageJson, message) && onEvent) {
        const data = parse(MiniAppsMessageJson, message);
        onEvent([data.eventType, data.eventData], next);
      } else {
        next();
      }
    };

    return;
  }

  // In all other environments, it is enough to define window.TelegramWebviewProxy.postEvent.
  const proxy = (window as any).TelegramWebviewProxy || {};
  const { postEvent } = proxy;
  (window as any).TelegramWebviewProxy = {
    ...proxy,
    postEvent(eventType: string, eventData: string) {
      const next = () => {
        postEvent && postEvent(eventType, eventData);
      };

      if (onEvent) {
        onEvent([eventType, eventData ? JSON.parse(eventData) : undefined], next);
      } else {
        next();
      }
    },
  };

  logInfo(false, 'Environment was mocked by the mockTelegramEnv function');
}
