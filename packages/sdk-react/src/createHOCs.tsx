import type { ComponentType } from 'react';
import type { PartialBy } from '@tma.js/sdk';

import type { HookRaw, HookResult } from './createHooks.js';

export interface HOC<Hook extends HookRaw<any> | HookResult<any>> {
  /**
   * Returns a component which is a HOC, passing some hook result to the wrapped component.
   * @param propKey - key, which will be used to pass a hook result.
   * @param optionsKey - key, containing hook arguments.
   * @param Component - component to wrap.
   */
  <
    PropKey extends string,
    OptionsKey extends string,
    Props extends { [K in OptionsKey]?: Parameters<Hook> } & { [K in PropKey]?: ReturnType<Hook> }
  >(
    propKey: PropKey,
    optionsKey: OptionsKey,
    Component: ComponentType<Props>,
  ): ComponentType<PartialBy<Props, PropKey | OptionsKey>>;
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
  function createHOC<Hook extends HookRaw<any> | HookResult<any>>(
    hook: Hook,
  ): HOC<Hook> {
    return <
      PropKey extends string,
      OptionsKey extends string,
      Props extends { [K in OptionsKey]?: Parameters<Hook> } & { [K in PropKey]?: ReturnType<Hook> }
    >(
      propKey: PropKey,
      optionsKey: OptionsKey,
      Component: ComponentType<Props>,
    ): ComponentType<PartialBy<Props, PropKey | OptionsKey>> => {
      return (props: PartialBy<Props, PropKey | OptionsKey>) => {
        const options: [] = props[optionsKey] || [];
        const merged: any = { ...props, [propKey]: hook(...options) };

        return <Component {...merged}/>;
      };
    };
  }

  return [createHOC(useRaw), createHOC(useResult)];
}
