/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface Cancel12Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 12
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const Cancel12: Component<Cancel12Props> = (props) => {
  const merged = mergeProps({ size: 12 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 12" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M2.293 2.293a1 1 0 0 1 1.414 0L6 4.586l2.293-2.293a1 1 0 0 1 1.414 1.414L7.414 6l2.293 2.293a1 1 0 0 1-1.414 1.414L6 7.414 3.707 9.707a1 1 0 0 1-1.414-1.414L4.586 6 2.293 3.707a1 1 0 0 1 0-1.414" clip-rule="evenodd"/></svg>
  );
}
