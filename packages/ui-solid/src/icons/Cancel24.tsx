/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface Cancel24Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 24
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const Cancel24: Component<Cancel24Props> = (props) => {
  const merged = mergeProps({ size: 24 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M4.506 4.44a.9.9 0 0 1 1.272-.008l6.226 6.143 6.225-6.143a.9.9 0 0 1 1.264 1.28l-6.208 6.127 6.208 6.127a.9.9 0 0 1-1.264 1.281l-6.225-6.143-6.226 6.143a.9.9 0 0 1-1.264-1.28l6.208-6.127-6.208-6.127a.9.9 0 0 1-.008-1.273" clip-rule="evenodd"/></svg>
  );
}
