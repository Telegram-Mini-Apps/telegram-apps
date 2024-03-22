/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface Cancel40Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 40
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const Cancel40: Component<Cancel40Props> = (props) => {
  const merged = mergeProps({ size: 40 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 40 40" width={merged.size} height={merged.size} {...props}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="m7 7 13 13m13 13L20 20m0 0L33 7M20 20 7 33"/></svg>
  );
}
