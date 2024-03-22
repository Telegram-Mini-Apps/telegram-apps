/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface ChevronDown28Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 28
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const ChevronDown28: Component<ChevronDown28Props> = (props) => {
  const merged = mergeProps({ size: 28 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M4.293 8.804a.974.974 0 0 1 1.414 0L14 17.422l8.293-8.618a.974.974 0 0 1 1.414 0 1.07 1.07 0 0 1 0 1.47l-8.293 8.617a1.947 1.947 0 0 1-2.828 0l-8.293-8.617a1.07 1.07 0 0 1 0-1.47" clip-rule="evenodd"/></svg>
  );
}
