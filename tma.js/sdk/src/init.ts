import {
  on,
  logger,
  retrieveLaunchParamsFp,
  type RetrieveLaunchParamsError,
  type PostEventError,
} from '@tma.js/bridge';
import { createCbCollector, throwifyFpFn } from '@tma.js/toolkit';
import type { Version } from '@tma.js/types';
import type { PostEventFpFn } from '@tma.js/bridge';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';

import { version } from '@/globals/version.js';
import { postEventFpSignal, postEventFp, postEvent } from '@/globals/post-event.js';
import { isInlineMode } from '@/globals/inline-mode.js';

export interface InitOptions {
  /**
   * True if SDK should accept styles sent from the Telegram application.
   * @default true
   */
  acceptCustomStyles?: boolean;
  /**
   * A custom `postEvent` function to use across the package.
   * @default tma.js/bridge's postEventFp function will be used.
   */
  postEvent?: PostEventFpFn;
  /**
   * Telegram Mini Apps version supported by the Telegram client.
   * @default Will be calculated based on the launch parameters' tgWebAppVersion field.
   */
  version?: Version;
  /**
   * True if the application is launched in inline mode.
   * @default Will be calculated based on the launch parameters' tgWebAppBotInline field.
   */
  isInlineMode?: boolean;
}

/**
 * Initializes the SDK allowing it to properly handle events, sent from the native Telegram
 * application. This function also configure the package's global dependencies (functions,
 * variables used across the package).
 * @param options - function options.
 * @returns A function, to perform a cleanup.
 */
export function initFp(
  options: InitOptions = {},
): E.Either<RetrieveLaunchParamsError | PostEventError, VoidFunction> {
  const { version: optionsVersion, isInlineMode: optionsInlineMode } = options;

  if (optionsVersion && typeof optionsInlineMode === 'boolean') {
    version.set(optionsVersion);
    isInlineMode.set(optionsInlineMode);
  } else {
    const error = pipe(retrieveLaunchParamsFp(), E.matchW(
      err => err,
      lp => {
        version.set(lp.tgWebAppVersion);
        isInlineMode.set(!!lp.tgWebAppBotInline);
      },
    ));
    if (error) {
      return E.left(error);
    }
  }
  if (options.postEvent) {
    postEventFpSignal.set(options.postEvent);
  }

  const [addCleanup, cleanup] = createCbCollector(
    on('reload_iframe', () => {
      logger().log('Received a request to reload the page');
      postEvent('iframe_will_reload');
      window.location.reload();
    }),
  );

  const { acceptCustomStyles = true } = options;
  if (acceptCustomStyles) {
    const style = document.createElement('style');
    style.id = 'telegram-custom-styles';
    document.head.appendChild(style);

    addCleanup(
      on('set_custom_style', html => {
        // It is safe to use innerHTML here as long as style tag has a special behavior related
        // to the specified content.
        // In case any script will be passed here, it will not be executed, so XSS is not possible.
        style.innerHTML = html;
      }),
      () => {
        document.head.removeChild(style);
      },
    );
  }

  // Notify Telegram that the application is ready.
  //
  // This will result in sending style tag html content from the Telegram web application.
  // We should call this method also to start receiving "reload_iframe" events from the Telegram
  // application.
  //
  // It really has no effect outside non-Telegram web environment.
  return pipe(
    postEventFp('iframe_ready', { reload_supported: true }),
    E.map(() => {
      logger().log('The package was initialized');
      return cleanup;
    }),
  );
}

/**
 * @see initFp
 */
export const init = throwifyFpFn(initFp);
