import { signal } from '@tma.js/signals';

export type PostMessage = typeof window.parent.postMessage;

/**
 * Signal containing a custom implementation of the method to post a message to the parent
 * window. We usually use it to send a message in web versions of Telegram.
 *
 * Initially, this value contains a function behaving like the `window.parent.postMessage` method.
 */
export const postMessageImpl = signal<PostMessage>((...args) => {
  window.parent.postMessage(...args as unknown as Parameters<PostMessage>);
});

/**
 * Posts a message to the parent window. We usually use it to send a message in web versions of
 * Telegram.
 * @param args - `window.parent.postMessage` arguments.
 */
export const postMessage: PostMessage = (...args) => {
  return postMessageImpl()(...args as unknown as Parameters<PostMessage>);
};
