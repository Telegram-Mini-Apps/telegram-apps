/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface Cancel16Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 16
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const Cancel16: Component<Cancel16Props> = (props) => {
  const merged = mergeProps({ size: 16 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M3.293 3.293a1 1 0 0 1 1.414 0L8 6.586l3.293-3.293a1 1 0 1 1 1.414 1.414L9.414 8l3.293 3.293a1 1 0 0 1-1.414 1.414L8 9.414l-3.293 3.293a1 1 0 0 1-1.414-1.414L6.586 8 3.293 4.707a1 1 0 0 1 0-1.414" clip-rule="evenodd"/></svg>
  );
}
