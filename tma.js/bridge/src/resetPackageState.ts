import { debug } from '@/debug.js';
import { offAll } from '@/events/emitter.js';
import { postMessageImplementation } from '@/methods/postMessage.js';
import { targetOrigin } from '@/methods/targetOrigin.js';

/**
 * Resets the package state. Normally, you don't use this function in your application.
 * We are using it only for test purposes.
 */
export function resetPackageState() {
  offAll();
  [postMessageImplementation, targetOrigin, debug].forEach(s => {
    s.unsubAll();
    s.reset();
  });
}
