/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface Cancel36Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 36
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const Cancel36: Component<Cancel36Props> = (props) => {
  const merged = mergeProps({ size: 36 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36" width={merged.size} height={merged.size} {...props}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m7 7 11 11m11 11L18 18m0 0L29 7M18 18 7 29"/></svg>
  );
}
