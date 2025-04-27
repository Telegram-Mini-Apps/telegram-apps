import { signal } from '@telegram-apps/signals';

import { logger } from '@/logger.js';

export type PostMessage = typeof window.parent.postMessage;

/**
 * Signal containing a custom implementation of the method to post a message to the parent
 * window. We usually use it to send a message in web versions of Telegram.
 *
 * Initially, this value contains a function behaving like the `window.parent.postMessage` method.
 */
export const postMessageImplementation = signal<PostMessage>((...args: any[]) => {
  try {
    window.parent.postMessage(...args as Parameters<PostMessage>);
  } catch (e) {
    if (e instanceof SyntaxError) {
      logger().forceError(
        'Unable to call window.parent.postMessage due to incorrectly configured target origin. Use the setTargetOrigin method to allow this origin to receive events',
        e,
      );
    } else {
      logger().forceError(e);
    }
  }
});

/**
 * Posts a message to the parent window. We usually use it to send a message in web versions of
 * Telegram.
 * @param args - `window.parent.postMessage` arguments.
 */
export const postMessage: PostMessage = (...args) => {
  return postMessageImplementation()(...args as unknown as Parameters<PostMessage>);
};
