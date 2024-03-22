/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface ChevronDown20Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 20
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const ChevronDown20: Component<ChevronDown20Props> = (props) => {
  const merged = mergeProps({ size: 20 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M3.293 6.293a1 1 0 0 1 1.414 0L10 11.586l5.293-5.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414" clip-rule="evenodd"/></svg>
  );
}
