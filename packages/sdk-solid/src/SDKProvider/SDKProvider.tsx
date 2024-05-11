import { AnyFn, initWeb, isIframe, setDebug } from '@tma.js/sdk';
import {
  Accessor,
  type Component,
  createEffect,
  createMemo,
  createResource,
  from,
  onCleanup,
} from 'solid-js';

import { SDKContext } from './SDKContext.js';
import {
  SDKContextItem,
  SDKContextType,
  SDKProviderProps,
} from './SDKProvider.types.js';

/**
 * Provides access to SDK components and initializes some event listeners for the web version
 * of Telegram.
 */
export const SDKProvider: Component<SDKProviderProps> = (props) => {
  const cache = new Map<AnyFn, SDKContextItem<AnyFn>>();

  const use: SDKContextType = (factory, ...args) => {
    // SDK context already has this value.
    if (cache.has(factory)) {
      return cache.get(factory)!;
    }

    // We are creating a resource as long as factory can sometimes return promise. For example,
    // this may happen in case, factory initializes BiometryManager or Viewport.
    const [resource] = createResource(() => {
      try {
        return factory(...args);
      } catch (e) {
        // Solid can't normally handle errors in a sync way. We need an error to be handled in
        // the first frame and this was the only 1 way of doing it I found.
        return [e];
      }
    });

    // Signal, which returns computed resource value.
    const getResource = createMemo(() => {
      // Something went wrong, return an error.
      if (resource.error) {
        return [resource.error];
      }

      // The resource is loading, return nothing. This usually happens when the factory is async.
      if (resource.state !== 'ready') {
        return;
      }

      // Get a value, stored in the resource and check if it ended up with an error.
      const value = resource();
      if (Array.isArray(value)) {
        return value;
      }

      // Factory may return undefined if it creates the InitData component, for example.
      // The returned component may also not allow tracking its changes. It means, it cannot
      // be reactive, we just this values as is.
      if (!value || !('on' in value)) {
        return value;
      }

      // Otherwise, we are making value reactive and track its changes.
      const get = from((set) => {
        set(value);
        return value.on('change', () => set(value));
      });

      // We use this value to retrieve properties having getters. We assume, that if property has
      // a getter, it must be reactive.
      // NOTE: Yeah, it looks horrible, but I had no other way of doing this.
      const prototype = Object.getPrototypeOf(value);

      // Cache with already defined signals.
      const propCache: Record<string | symbol, Accessor<any>> = {};

      return new Proxy(value, {
        get(target: any, property: string | symbol): any {
          if (!(property in propCache)) {
            const descriptor = Reflect.getOwnPropertyDescriptor(prototype, property);

            // We receive descriptor, describing this property and check if it has getter. In
            // case it does, we must make it reactive. Otherwise, we return real value behind
            // this property.
            propCache[property] = descriptor && ('get' in descriptor)
              ? createMemo(() => (get() as any)[property])
              : () => Reflect.get(target, property);
          }
          return propCache[property]();
        },
      });
    });

    // Define accessor.
    function read() {
      const v = getResource();
      if (Array.isArray(v)) {
        throw v[0];
      }
      return v;
    }

    // Define accessor "error" property.
    Object.defineProperty(read, 'error', {
      get() {
        const v = getResource();
        return Array.isArray(v) ? v[0] : undefined;
      },
    });

    cache.set(factory, read);

    return read;
  }

  // Effect, responsible for debug mode.
  createEffect(() => {
    setDebug(props.debug || false);
  });

  // Effect, responsible for initializing the app in the web version of Telegram.
  createEffect(() => {
    if (isIframe()) {
      onCleanup(initWeb(props.acceptCustomStyles));
    }
  });

  return <SDKContext.Provider value={use}>{props.children}</SDKContext.Provider>;
};
