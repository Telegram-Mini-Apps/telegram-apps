import { on, createCleanup } from '@telegram-apps/bridge';
import type { VoidFn } from '@telegram-apps/types';

import { $postEvent } from '@/scopes/globals/globals.js';

/**
 * Performs the initialization process in the web version of Telegram.
 * @param acceptCustomStyles - true if SDK should accept styles sent from the Telegram web
 * application. This option is only used in web versions of Telegram. Default: true.
 * @returns Function, which performs cleanup removing all created elements and listeners.
 */
export function initWeb(acceptCustomStyles = true): VoidFn {
  const [addCleanup, cleanup] = createCleanup(
    on('reload_iframe', () => {
      $postEvent()('iframe_will_reload');
      window.location.reload();
    }),
  );

  if (acceptCustomStyles) {
    const style = document.createElement('style');
    style.id = 'telegram-custom-styles';
    document.head.appendChild(style);

    addCleanup(
      on('set_custom_style', (html) => {
        // It is safe to use innerHTML here as long as style tag has a special behavior related
        // to the specified content. In case, any script will be passed here, it will not be
        // executed.
        style.innerHTML = html;
      }),
      () => document.head.removeChild(style),
    );
  }

  // Notify Telegram, iframe is ready. This will result in sending style tag html from native
  // application which is used in catchCustomStyles function. We should call this method also
  // to start receiving "reload_iframe" events from the Telegram application.
  $postEvent()('iframe_ready', { reload_supported: true });

  return cleanup;
}
