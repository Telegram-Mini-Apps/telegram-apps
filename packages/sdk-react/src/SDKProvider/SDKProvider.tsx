import { initWeb, isIframe, setDebug } from '@tma.js/sdk';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AnyFn } from '@tma.js/sdk';

import { SDKContext } from './SDKContext.js';
import {
  SDKContextType,
  SDKProviderProps,
  SDKContextItem,
} from './SDKProvider.types.js';

/**
 * Provides access to the SDK components and initializes some event listeners for the web version
 * of Telegram.
 */
export function SDKProvider({ children, acceptCustomStyles, debug }: SDKProviderProps) {
  // Mount flag. We need it to safely call state setters, as long as React forbids these
  // operations on unmounted components.
  const mounted = useRef(true);

  // Map, containing all registered factory results.
  const [cache, setCache] = useState<Map<AnyFn, SDKContextItem<any>>>(
    () => new Map(),
  );

  // Safely mutates cache with specified function.
  const mutateCache = useCallback((mutate?: (state: typeof cache) => void) => {
    if (mounted.current) {
      setCache(c => {
        if (mutate) {
          mutate(c);
        }
        return new Map(c);
      });
    }
  }, []);

  // Forcefully refreshes the cache. We need this function to notify subscribers about cache
  // changes.
  const forceRefresh = useCallback(() => mutateCache(), [mutateCache]);

  // List of trackable components. We don't use memo or signals as long there is no real
  // reason to track this list changes. We use only to remove "change" listeners on the component
  // unmount.
  const trackable = useRef<{ on: any; off: any }[]>([]);

  const context = useMemo<SDKContextType>(() => ({
    use(factory, ...args) {
      const cached = cache.get(factory);
      if (cached) {
        return cached;
      }

      let item: SDKContextItem<any>;
      try {
        item = { result: factory(...args) };
      } catch (error) {
        item = { error };
      }

      if ('error' in item || !item.result) {
        cache.set(factory, item);
        return item;
      }

      const processResult = (result: any): SDKContextItem<any> => {
        if ('on' in result) {
          result.on('change', forceRefresh);
          trackable.current.push(result);
        }
        return { result };
      };

      if (item.result as any instanceof Promise) {
        item.result.then(
          (result: any) => mutateCache(c => c.set(factory, processResult(result))),
          (error: any) => mutateCache(c => c.set(factory, { error })),
        );
        cache.set(factory, {});
        return {};
      }

      cache.set(factory, item = processResult(item.result));
      return item;
    },
  }), [cache]);

  // Effect, responsible for debug mode.
  useEffect(() => {
    setDebug(debug || false);
  }, [debug]);

  // Effect, responsible for changing mount state.
  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  // Effect, responsible for initializing the app in the web version of Telegram.
  useEffect(() => {
    if (isIframe()) {
      return initWeb(acceptCustomStyles);
    }
  }, [acceptCustomStyles]);

  // Effect, responsible for removing all components "change" listeners.
  useEffect(() => {
    return () => trackable.current.forEach(item => item.off('change', forceRefresh));
  }, [forceRefresh]);

  return <SDKContext.Provider value={context}>{children}</SDKContext.Provider>;
}
