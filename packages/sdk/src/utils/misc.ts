import {Bridge, init} from 'twa-bridge';

/**
 * Accepts bridge instance or undefined and guaranteed to return initialized
 * bridge instance. This function is mostly used by components to unify
 * bridge creation logic.
 * @param bridge - bridge instance or undefined.
 */
export function processBridgeProp(bridge: Bridge | undefined): Bridge {
  return bridge === undefined ? init() : bridge;
}