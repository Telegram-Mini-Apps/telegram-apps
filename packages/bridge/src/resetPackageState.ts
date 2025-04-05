import { targetOrigin } from '@/methods/targetOrigin.js';
import { setDebug } from '@/debug.js';
import { offAll } from '@/events/emitter.js';
import { postMessageImplementation } from '@/methods/postMessage.js';

/**
 * Resets the package state. Normally, you don't use this function in your application.
 * We are using it only for test purposes.
 */
export function resetPackageState() {
  offAll();
  setDebug(false);
  [postMessageImplementation, targetOrigin].forEach(s => {
    s.unsubAll();
    s.reset();
  });
}