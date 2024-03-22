/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface ChevronUp24Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 24
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const ChevronUp24: Component<ChevronUp24Props> = (props) => {
  const merged = mergeProps({ size: 24 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M4.293 16.207a1 1 0 0 0 1.414 0L12.5 9.414l6.793 6.793a1 1 0 0 0 1.414-1.414l-7.5-7.5a1 1 0 0 0-1.414 0l-7.5 7.5a1 1 0 0 0 0 1.414" clip-rule="evenodd"/></svg>
  );
}
