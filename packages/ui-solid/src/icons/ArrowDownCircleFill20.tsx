/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface ArrowDownCircleFill20Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 20
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const ArrowDownCircleFill20: Component<ArrowDownCircleFill20Props> = (props) => {
  const merged = mergeProps({ size: 20 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M10 19a9 9 0 1 0 0-18 9 9 0 0 0 0 18m.75-13a.75.75 0 0 0-1.5 0v6.19L7.03 9.97a.75.75 0 0 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 1 0-1.06-1.06l-2.22 2.22z" clip-rule="evenodd"/></svg>
  );
}
