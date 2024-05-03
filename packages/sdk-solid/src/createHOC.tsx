import { type Component, mergeProps } from 'solid-js';
import type { PartialBy } from '@tma.js/sdk';

import type { Hook } from './createHook.js';

export interface HOC<P extends string, H extends Hook<any>> {
  <Props extends { [K in P]: ReturnType<H> }>(
    Component: Component<Props>,
    ...args: Parameters<H>
  ): Component<PartialBy<Props, P>>;
}

/**
 * Based on the passed hook, creates function returning HOC. Created HOC passes hook result
 * to the wrapped component.
 * @param prop - target property name.
 * @param hook - hook returning component.
 */
export function createHOC<P extends string, H extends Hook<any>>(prop: P, hook: H): HOC<P, H> {
  return (Component, ...args) => {
    return (props) => {
      return <Component {...mergeProps({ [prop]: hook(...args) }, props) as any}/>;
    };
  };
}
