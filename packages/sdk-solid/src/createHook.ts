import { AnyFn } from '@tma.js/sdk';

import { useSDK } from './SDKProvider/SDKContext.js';
import { SDKContextItem } from './SDKProvider/SDKProvider.types.js';

export interface Hook<Factory extends AnyFn> {
  (...args: Parameters<Factory>): SDKContextItem<Factory>;
}

/**
 * Creates new hook, which firstly attempts to extract a value from the SDK context. In case,
 * value is missing, it uses the passed component factory, creates a component, subscribes
 * to its changes if required, and returns its reactive copy.
 * @param fn
 */
export function createHook<Fn extends AnyFn>(fn: Fn): Hook<Fn> {
  return (...args) => useSDK()(fn, ...args);
}
