import { on } from '@/bridge/events/on.js';
import { createPostEvent } from '@/bridge/methods/createPostEvent.js';
import { isIframe } from '@/env/isIframe.js';
import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';
import type { CleanupFn } from '@/types/misc.js';
import type { Version } from '@/version/types.js';

export interface InitOptions {
  /**
   * True if SDK should accept styles sent from the Telegram web application. This option is only
   * used in web versions of Telegram.
   * @default false
   */
  acceptCustomStyles?: boolean;
  /**
   * Mini Apps version.
   * @default Will be extracted from the current environment.
   */
  version?: Version;
}

/**
 * Runs initialization flow, common for all Mini Apps.
 * @param options - init options.
 * @returns Function, which performs cleanup removing all created elements and listeners.
 */
export function init(options: InitOptions = {}): CleanupFn {
  const {
    acceptCustomStyles = false,
    version = retrieveLaunchParams().version,
  } = options;
  const postEvent = createPostEvent(version);
  const listeners: CleanupFn[] = [];
  const cleanup = () => listeners.forEach((l) => l());

  // In Telegram web version we should listen to special event sent from the Telegram application
  // to know, when we should reload the Mini App.
  if (!isIframe()) {
    return cleanup;
  }

  if (acceptCustomStyles) {
    const element = document.createElement('style');
    element.id = 'telegram-custom-styles';
    document.head.appendChild(element);

    listeners.push(
      on('set_custom_style', (html) => {
        // It is safe to use innerHTML here as long as style tag has a special behavior related
        // to the specified content. In case, any script will be passed here, it will not be
        // executed.
        element.innerHTML = html;
      }),
    );

    listeners.push(() => document.head.removeChild(element));
  }

  // Notify Telegram, iframe is ready. This will result in sending style tag html from native
  // application which is used in catchCustomStyles function. We should call this method also
  // to start receiving "reload_iframe" events from the Telegram application.
  postEvent('iframe_ready', { reload_supported: true });
  listeners.push(
    on('reload_iframe', () => {
      postEvent('iframe_will_reload');
      window.location.reload();
    }),
  );

  return cleanup;
}
