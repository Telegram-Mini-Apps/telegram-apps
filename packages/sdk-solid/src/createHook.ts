import { createMemo, createResource, from } from 'solid-js';
import type { Accessor } from 'solid-js';

import { useSDK } from './SDKProvider/SDKContext.js';

interface AnyFn {
  (...args: any): any;
}

/**
 * Hook execution result. Represents weak implementation of Solid Resource.
 */
export interface HookResource<Factory extends AnyFn> {
  /**
   * Returns factory execution result.
   * @throws An error, if it occurred during factory call. Use the "error" property before
   * to check if something went wrong.
   */
  (): ReturnType<Factory> extends PromiseLike<infer R> ? R | undefined : ReturnType<Factory>;
  /**
   * Error occurred during factory call.
   */
  error?: any;
}

export interface Hook<Factory extends AnyFn> {
  (...args: Parameters<Factory>): HookResource<Factory>;
}

/**
 * Creates new hook, which firstly attempts to extract a value from the SDK context. In case,
 * value is missing, it uses the passed component factory, creates a component, subscribes
 * to its changes if required, and returns its reactive copy.
 * @param fn
 */
export function createHook<Fn extends AnyFn>(fn: Fn): Hook<Fn> {
  return (...args) => {
    const cache = useSDK();

    // SDK context already has this value.
    if (cache.has(fn)) {
      return cache.get(fn)!;
    }

    // We are creating a resource as long as factory can sometimes return promise. For example,
    // this may happen in case, factory initializes BiometryManager or Viewport.
    const [resource] = createResource(() => {
      try {
        return fn(...args as any);
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
      get: () => {
        const v = getResource();
        return Array.isArray(v) ? v[0] : undefined;
      },
    });

    cache.set(fn, read);

    return read;
  };
}
