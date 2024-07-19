import { signal } from '@/reactivity/signal.js';
import { postEvent as defaultPostEvent } from '@/bridge/methods/postEvent.js';

const [
  get,
  set,
  track,
  untrack,
  untrackAll,
] = signal(defaultPostEvent);

export {
  /**
   * Returns a function calling Mini Apps methods.
   */
  get,
  /**
   * Sets a new function calling Mini Apps methods.
   */
  set,
  /**
   * Adds a new listener tracking a function calling Mini Apps methods changes.
   */
    track,
  /**
   * Removes a listener tracking a function calling Mini Apps methods changes.
   */
    untrack,
  /**
   * Removes all listeners tracking a function calling Mini Apps methods changes.
   */
    untrackAll,
};