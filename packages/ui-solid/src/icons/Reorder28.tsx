/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface Reorder28Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 28
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const Reorder28: Component<Reorder28Props> = (props) => {
  const merged = mergeProps({ size: 28 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M3.1 9a.9.9 0 0 1 .9-.9h20a.9.9 0 1 1 0 1.8H4a.9.9 0 0 1-.9-.9m0 5a.9.9 0 0 1 .9-.9h20a.9.9 0 1 1 0 1.8H4a.9.9 0 0 1-.9-.9m0 5a.9.9 0 0 1 .9-.9h20a.9.9 0 1 1 0 1.8H4a.9.9 0 0 1-.9-.9" clip-rule="evenodd"/></svg>
  );
}
