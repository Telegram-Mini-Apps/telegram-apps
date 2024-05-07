import { useMemo, useRef, useState } from 'react';
import { createMemo, createResource, from } from 'solid-js';
import type { Accessor } from 'solid-js';

import { useSDK } from './SDKProvider/SDKContext.js';
import { useFn } from './useFn.js';
import { useOnce } from './useOnce.js';

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

    const lll = useMemo(() => {
      // SDK context already has this value.
      if (sdk.has(fn)) {
        return sdk.get(fn);
      }

      const value = fn(...args);
    }, [sdk]);


    const state = useFn(() => {
      // SDK context already has this value.
      if (sdk.has(fn)) {
        return sdk.get(fn)!;
      }
      return fn(...args);
    });


    const value = useMemo(() => {
      if (sdk.has(fn)) {
        return sdk.get(fn);
      }
    });

    // We are creating a resource as long as factory can sometimes return promise. For example,
    // this may happen in case, factory initializes BiometryManager or Viewport.
    const [resource] = createResource(() => fn(...args as any));

    // Create signal, which will be used externally.
    const getResult = createMemo(() => {
      if (resource.state !== 'ready') {
        return;
      }

      // Factory may return undefined if it creates the InitData component, for example.
      const value = resource();
      if (!value) {
        return;
      }

      // Value doesn't allow tracking its changes. It means, it cannot be reactive, we just return
      // it as is.
      if (!('on' in value)) {
        return value;
      }

      // Otherwise, we are making value reactive and track its changes.
      const get = from((set) => {
        set(value);
        return value.on('change', () => set(value));
      });

      // Construct a reactive copy of the component.
      return Object
        // We use this way to retrieve all properties descriptors. Event for getters-only.
        // NOTE: Yeah, it looks horrible, but I had no other way of doing this.
        .entries(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(value)))
        .reduce((acc, [key, descriptor]) => {
          // Special key we are ignoring.
          if (key === 'constructor') {
            return acc;
          }

          if ('get' in descriptor) {
            // Otherwise, we are dealing with a dynamic property, which must be memoized.
            Object.defineProperty(acc, key, {
              get: createMemo(() => (get() as any)[key]),
              enumerable: true,
            });
          }

          return acc;
        }, value);
    });

    sdk.set(fn, getResult);

    return getResult;
  };
}
