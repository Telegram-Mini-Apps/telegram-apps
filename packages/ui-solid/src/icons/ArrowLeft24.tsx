/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface ArrowLeft24Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 24
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const ArrowLeft24: Component<ArrowLeft24Props> = (props) => {
  const merged = mergeProps({ size: 24 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M10.626 4.265a1 1 0 0 1 .058 1.413L5.78 11H20.5a1 1 0 1 1 0 2H5.78l4.904 5.323a1 1 0 1 1-1.471 1.354l-6.448-7a1 1 0 0 1 0-1.354l6.448-7a1 1 0 0 1 1.413-.058" clip-rule="evenodd"/></svg>
  );
}
