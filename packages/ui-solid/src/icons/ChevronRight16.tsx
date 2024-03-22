/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface ChevronRight16Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 16
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const ChevronRight16: Component<ChevronRight16Props> = (props) => {
  const merged = mergeProps({ size: 16 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" width={merged.size} height={merged.size} {...props}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 3 5 5-5 5"/></svg>
  );
}
