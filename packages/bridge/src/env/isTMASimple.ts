import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';

/**
 * Represent a simpler synchronous version of the `isTMA` function.
 *
 * It only checks if the current environment contains launch parameters.
 * @see isTMA
 */
export function isTMASimple(): boolean {
  try {
    retrieveLaunchParams();
    return true;
  } catch {
    return false;
  }
}