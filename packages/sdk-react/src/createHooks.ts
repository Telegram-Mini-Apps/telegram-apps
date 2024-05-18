import { type CleanupFn, isSSR, type AnyFn } from '@tma.js/sdk';
import { useEffect, useState } from 'react';

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

    const [result, setResult] = useState<SDKContextItem<HookFnResult<Factory>> | undefined>(
      ssr
        // If SSR mode is enabled, we have no initial value. In this case we will set something
        // only in useEffect.
        ? undefined
        // Otherwise, we are retrieving this factory result.
        : () => {
          if (isSSR()) {
            throw new Error('Using hooks on the server side, you must explicitly specify ssr = true option');
          }
          return sdk.use(factory);
        },
    );

    // Each time sdk context changes, we are updating the local value.
    useEffect(() => {
      setResult(sdk.use(factory));
    }, [sdk]);

    return result;
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
