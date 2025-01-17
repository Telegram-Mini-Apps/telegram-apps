import { targetOrigin } from '@/methods/targetOrigin.js';
import { setDebug } from '@/debug.js';
import { offAll } from '@/events/emitter.js';

/**
 * Resets the package state. Normally, you don't use this function in your application.
 * We are using it only for test purposes.
 */
export function resetPackageState() {
  offAll();
  setDebug(false);
  targetOrigin.unsubAll();
  targetOrigin.reset();
}