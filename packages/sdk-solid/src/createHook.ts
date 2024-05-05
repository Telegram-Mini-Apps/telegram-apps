import { createMemo, createResource, from } from 'solid-js';
import type { Accessor } from 'solid-js';

import { useSDK } from './SDKProvider/SDKContext.js';

interface AnyFn {
  (...args: any): any;
}

export interface Hook<Factory extends AnyFn> {
  (...args: Parameters<Factory>): Accessor<
    ReturnType<Factory> extends PromiseLike<infer R>
      ? R | undefined
      : ReturnType<Factory>
  >;
}

/**
 * Creates new hook, which firstly attempts to extract a value from the SDK context. In case,
 * value is missing, it uses the passed component factory, creates a component, subscribes
 * to its changes if required, and returns its reactive copy.
 * @param fn
 */
export function createHook<Fn extends AnyFn>(fn: Fn): Hook<Fn> {
  return (...args) => {
    const sdk = useSDK();

    // SDK context already has this value.
    if (sdk.has(fn)) {
      return sdk.get(fn)!;
    }

    // We are creating a resource as long as factory can sometimes return promise. For example,
    // this may happen in case, factory initializes BiometryManager or Viewport.
    const [resource] = createResource(() => fn(...args as any));

    // Create signal, which will be used externally.
    const getResult = createMemo(() => {
      if (resource.state !== 'ready') {
        return;
      }

      // Factory may return undefined if it creates the InitData component, for example.
      // It also may not allow tracking its changes. It means, it cannot be reactive, we just
      // this values as is.
      const value = resource();
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
      const cache: Record<string | symbol, Accessor<any>> = {};

      return new Proxy(value, {
        get(target: any, property: string | symbol): any {
          if (!(property in cache)) {
            const descriptor = Reflect.getOwnPropertyDescriptor(prototype, property);

            // We receive descriptor, describing this property and check if it has getter. In
            // case it does, we must make it reactive. Otherwise, we return real value behind
            // this property.
            cache[property] = descriptor && ('get' in descriptor)
              ? createMemo(() => (get() as any)[property])
              : () => Reflect.get(target, property);
          }
          return cache[property]();
        },
      });
    });

    sdk.set(fn, getResult);

    return getResult;
  };
}
