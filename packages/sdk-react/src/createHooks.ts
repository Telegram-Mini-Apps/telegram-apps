import { type CleanupFn, isSSR, type AnyFn } from '@tma.js/sdk';
import { useMemo } from 'react';

import { useSDK } from './SDKProvider/SDKContext.js';
import type { SDKContextItem } from './SDKProvider/SDKProvider.types.js';

type ExtractResult<T> = T extends [result: infer R, cleanup: CleanupFn]
  ? ExtractResult<R>
  : T extends Promise<infer U>
    ? U | undefined
    : T;

type HookFnResult<Fn extends AnyFn> = ExtractResult<ReturnType<Fn>>;

interface Hook<Result> {
  (ssr?: false): Result;
  (ssr: true): Result | undefined;
}

export interface HookRaw<Factory extends AnyFn>
  extends Hook<SDKContextItem<HookFnResult<Factory>>> {
}

export interface HookResult<Factory extends AnyFn> extends Hook<HookFnResult<Factory>> {
}

export type Hooks<Factory extends AnyFn> = [
  useRaw: HookRaw<Factory>,
  useResult: HookResult<Factory>,
];

/**
 * @returns Hooks, simplifying work process with the SDK components.
 */
export function createHooks<Factory extends AnyFn>(factory: Factory): Hooks<Factory> {
  function useRaw(ssr?: false): SDKContextItem<HookFnResult<Factory>>;
  function useRaw(ssr: true): SDKContextItem<HookFnResult<Factory>> | undefined;
  function useRaw(ssr?: boolean): SDKContextItem<HookFnResult<Factory>> | undefined {
    const sdk = useSDK();

    return useMemo(() => {
      if (isSSR()) {
        if (!ssr) {
          throw new Error('Using hooks on the server side, you must explicitly specify pass ssr = true');
        }
        return;
      }
      return sdk.use(factory);
    }, [sdk, ssr]);
  }

  function useResult(ssr?: false): HookFnResult<Factory>;
  function useResult(ssr: true): HookFnResult<Factory> | undefined;
  function useResult(ssr?: boolean): HookFnResult<Factory> | undefined {
    const raw = useRaw(ssr as any);
    if (!raw) {
      return;
    }
    if ('error' in raw) {
      throw raw.error;
    }
    return raw.result;
  }

  return [useRaw, useResult];
}
