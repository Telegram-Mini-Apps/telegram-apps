import { MethodName, supports } from '@telegram-apps/bridge';
import { $version } from '@/scopes/globals.js';

/**
 * @returns A function returning true if the specified Mini Apps method is supported.
 * @param method - Mini Apps method name
 */
export function createIsSupported(method: MethodName) {
  return function isSupported(): boolean {
    return supports(method, $version());
  }
}