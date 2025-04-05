import { signal } from '@telegram-apps/signals';

export type PostMessage = typeof window.parent.postMessage;

/**
 * Signal containing a custom implementation of the method to post a message to the parent
 * window. We usually use it to send a message in web versions of Telegram.
 *
 * Initially, this value contains a function behaving like the `window.parent.postMessage` method.
 */
export const postMessageImplementation = signal<PostMessage>((...args: any[]) => {
  return window.parent.postMessage(...args as Parameters<PostMessage>);
});

/**
 * Posts a message to the parent window. We usually use it to send a message in web versions of Telegram.
 * @param args - `window.parent.postMessage` arguments.
 */
export const postMessage: PostMessage = (...args) => {
  return postMessageImplementation()(...args as unknown as Parameters<PostMessage>);
};
