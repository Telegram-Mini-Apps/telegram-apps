/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface SunLow24Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 24
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const SunLow24: Component<SunLow24Props> = (props) => {
  const merged = mergeProps({ size: 24 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M12 15.45a3.45 3.45 0 1 0 0-6.9 3.45 3.45 0 0 0 0 6.9m0 1.8a5.25 5.25 0 1 0 0-10.5 5.25 5.25 0 0 0 0 10.5" clip-rule="evenodd"/><path fill="currentColor" d="M19.5 5.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-13 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m15 6.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-17 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m15 6.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-6.5 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-6.5-2a1 1 0 1 1-2 0 1 1 0 0 1 2 0m6.5-15a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>
  );
}
