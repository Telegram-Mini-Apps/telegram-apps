/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface ChevronLeft24Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 24
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const ChevronLeft24: Component<ChevronLeft24Props> = (props) => {
  const merged = mergeProps({ size: 24 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M15.707 3.793a1 1 0 0 0-1.414 0l-7.5 7.5a1 1 0 0 0 0 1.414l7.5 7.5a1 1 0 0 0 1.414-1.414L8.914 12l6.793-6.793a1 1 0 0 0 0-1.414" clip-rule="evenodd"/></svg>
  );
}
