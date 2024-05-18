import { CleanupFn, initWeb, isIframe, setDebug } from '@tma.js/sdk';
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
  // We need it to safely call state setters as long as React forbids these
  // operations on unmounted components.
  const canUpdateState = useRef(true);

  // Map, containing all registered factories results.
  const cacheRef = useRef(new Map<AnyFn, SDKContextItem<any>>());

  // Forcefully refreshes the cache. We need this function to notify subscribers about cache
  // changes.
  const [temp, setTemp] = useState([]);
  const forceRefresh = useCallback(() => setTemp([]), []);

  // Safely mutates cache with specified function.
  const mutateCache = useCallback(
    (mutate?: (state: Map<AnyFn, SDKContextItem<any>>) => void) => {
      if (canUpdateState.current) {
        mutate && mutate(cacheRef.current);
        forceRefresh();
      }
    }, [forceRefresh],
  );

  const context = useMemo<SDKContextType>(() => ({
    use(factory, ...args) {
      const { current: cache } = cacheRef;

      // Try to get a cached value.
      const cached = cache.get(factory);
      if (cached) {
        return cached;
      }

      // Call factory and retrieve result.
      let result: any;
      let error: any;
      try {
        result = factory(...args);
      } catch (err) {
        error = err;
      }

      function withCacheSet(item: SDKContextItem<any>): SDKContextItem<any> {
        cache.set(factory, item);
        return item;
      }

      // If an error occurred, return it.
      if (error) {
        return withCacheSet({ error });
      }

      // Result may represent a tuple, where a result is placed on the first place, and
      // a cleanup function on the second one.
      let cleanup: CleanupFn | undefined;
      if (Array.isArray(result)) {
        cleanup = result[1];
        result = result[0];
      }

      // We may have a case, when result is empty (most likely undefined), for example, when
      // we initialize InitData. In this case we just return the result.
      if (!result) {
        return withCacheSet({ result, cleanup });
      }

      // Adds change event listener to the value if required, and adds bound listener to the
      // cleanup function.
      function finalize(v: any): SDKContextItem<any> {
        if ('on' in v) {
          const off = v.on('change', forceRefresh);
          const original = cleanup;
          cleanup = () => {
            original && original();
            off();
          };
        }
        return { result: v, cleanup };
      }

      if (result instanceof Promise) {
        result.then(
          (value: any) => mutateCache(c => c.set(factory, finalize(value))),
          (error: any) => mutateCache(c => c.set(factory, { error })),
        );
        return withCacheSet({});
      }
      return withCacheSet(finalize(result));
    },
  }), [temp]);

  // Effect, responsible for initializing the app in the web version of Telegram.
  useEffect(() => {
    if (isIframe()) {
      return initWeb(acceptCustomStyles);
    }
  }, [acceptCustomStyles]);

  // Effect, responsible for debug mode.
  useEffect(() => {
    setDebug(debug || false);
  }, [debug]);

  // Effect, responsible for changing mount state.
  useEffect(() => {
    return () => {
      canUpdateState.current = false;
    };
  }, []);

  // Effect, responsible for removing all components "change" listeners.
  useEffect(() => {
    return () => {
      cacheRef.current.forEach(v => {
        'cleanup' in v && v.cleanup && v.cleanup();
      });
    };
  }, [forceRefresh]);

  return <SDKContext.Provider value={context}>{children}</SDKContext.Provider>;
}
