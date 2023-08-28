import { postEvent } from '@twa.js/bridge';

/**
 * Wrapper around bridge's postEvent function which calls original one catching an error.
 * @param args - postEvent function arguments.
 */
export const safePostEvent: typeof postEvent = (...args: any[]) => {
  try {
    return (postEvent as any)(...args);
  } catch (e) {
  }
};