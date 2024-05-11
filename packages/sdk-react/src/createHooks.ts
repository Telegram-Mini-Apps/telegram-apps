import { AnyFn } from '@tma.js/sdk';
import { useMemo } from 'react';

import { useSDK } from './SDKProvider/SDKContext.js';
import { SDKContextItem } from './SDKProvider/SDKProvider.types.js';

type HookFnResult<Fn extends AnyFn> = ReturnType<Fn> extends Promise<infer T>
  ? T | undefined
  : ReturnType<Fn>;

export interface HookRaw<Fn extends AnyFn> {
  /**
   * Hook, which retrieves SDK context item of the specified factory. This hook is safe
   * to be used and not throwing errors.
   */
  (...args: Parameters<Fn>): SDKContextItem<HookFnResult<Fn>>;
}

export interface HookResult<Fn extends AnyFn> {
  /**
   * Hook, which retrieves a result of the factory.
   * @throws An error, if factory execution was unsuccessful.
   */
  (...args: Parameters<Fn>): HookFnResult<Fn>;
}

export type Hooks<Fn extends AnyFn> = [useRaw: HookRaw<Fn>, useResult: HookResult<Fn>];

/**
 * @returns Hooks, simplifying work process with the SDK components.
 */
export function createHooks<Fn extends AnyFn>(fn: Fn): Hooks<Fn> {
  const useRaw = (...args: Parameters<Fn>): SDKContextItem<HookFnResult<Fn>> => {
    const sdk = useSDK();
    return useMemo(() => sdk.use(fn, ...args), [sdk]);
  };

  const useResult = (...args: Parameters<Fn>): HookFnResult<Fn> => {
    const raw = useRaw(...args);
    if ('error' in raw) {
      throw raw.error;
    }
    return raw.result as HookFnResult<Fn>;
  };

  return [useRaw, useResult];
}
