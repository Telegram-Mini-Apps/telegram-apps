/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface ArrowLeft20Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 20
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const ArrowLeft20: Component<ArrowLeft20Props> = (props) => {
  const merged = mergeProps({ size: 20 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M10.013 2.283a1 1 0 0 1 .02 1.414L5.366 8.5H18a1 1 0 1 1 0 2H5.366l4.667 4.803a1 1 0 1 1-1.434 1.394l-6.316-6.5a1 1 0 0 1 0-1.394l6.316-6.5a1 1 0 0 1 1.414-.02" clip-rule="evenodd"/></svg>
  );
}
