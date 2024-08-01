import type { RemoveEventListenerFn } from './types.js';

/**
 * Adds new event listener using window.addEventListener.
 * @param type - event name.
 * @param listener - event listener.
 * @param options - listening options.
 * @returns Function to remove event listener.
 */
export function onWindow<K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
): RemoveEventListenerFn {
  window.addEventListener(type, listener, options);
  return () => window.removeEventListener(type, listener, options);
}
