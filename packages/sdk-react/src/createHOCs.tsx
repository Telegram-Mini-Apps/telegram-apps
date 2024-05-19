import type { ComponentType } from 'react';

import type { Hook, HookRaw, HookResult } from './createHooks.js';

export interface HOC<H extends HookRaw<any> | HookResult<any>> {
  /**
   * Returns a component which is a HOC, passing some hook result to the wrapped component.
   * @param propKey - key, which will be used to pass a hook result.
   * @param ssr - is SSR mode enabled.
   * @param Component - component to wrap.
   */<
    PropKey extends string,
    SSR extends boolean,
    Props,
  >(
    propKey: PropKey,
    ssr: SSR,
    Component: ComponentType<Omit<Props, PropKey> & {
      [K in PropKey]: ReturnType<Hook<Exclude<ReturnType<H>, undefined>, SSR>>
    }>,
  ): ComponentType<Omit<Props, PropKey>>;
}

export type HOCs<HRaw extends HookRaw<any>, HResult extends HookResult<any>> = [
  HOC<HRaw>,
  HOC<HResult>
];

/**
 * Based on the passed hook, creates function returning HOC. Created HOC passes hook result
 * to the wrapped component.
 * @param useRaw - hook, returning a raw SDK item.
 * @param useResult - hook, returning an SDK item with the result.
 */
export function createHOCs<HRaw extends HookRaw<any>, HResult extends HookResult<any>>(
  useRaw: HRaw,
  useResult: HResult,
): HOCs<HRaw, HResult> {
  function createHOC<Hook extends HookRaw<any> | HookResult<any>>(hook: Hook): HOC<Hook> {
    return function HOC(propKey, ssr, Component) {
      return (props) => {
        const merged: any = {
          ...props,
          [propKey]: hook(ssr as any),
        };

        return <Component {...merged}/>;
      };
    };
  }

  return [createHOC(useRaw), createHOC(useResult)];
}
