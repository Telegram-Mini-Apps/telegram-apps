/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface EllipsisVertical28Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 28
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const EllipsisVertical28: Component<EllipsisVertical28Props> = (props) => {
  const merged = mergeProps({ size: 28 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M14 9.335a2.34 2.34 0 0 0 2.334-2.333 2.34 2.34 0 0 0-2.333-2.333 2.34 2.34 0 0 0-2.334 2.333 2.34 2.34 0 0 0 2.334 2.333m0 2.334a2.34 2.34 0 0 0-2.333 2.333 2.34 2.34 0 0 0 2.334 2.333 2.34 2.34 0 0 0 2.333-2.333 2.34 2.34 0 0 0-2.333-2.333m-2.333 9.333a2.34 2.34 0 0 1 2.334-2.333 2.34 2.34 0 0 1 2.333 2.333 2.34 2.34 0 0 1-2.333 2.333 2.34 2.34 0 0 1-2.334-2.333" clip-rule="evenodd"/></svg>
  );
}
