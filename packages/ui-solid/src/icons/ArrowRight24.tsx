/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface ArrowRight24Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 24
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const ArrowRight24: Component<ArrowRight24Props> = (props) => {
  const merged = mergeProps({ size: 24 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M13.374 4.265a1 1 0 0 1 1.413.057l6.448 7a1 1 0 0 1 0 1.356l-6.448 7a1 1 0 1 1-1.47-1.355L18.218 13H3.5a1 1 0 1 1 0-2h14.72l-4.904-5.322a1 1 0 0 1 .058-1.413" clip-rule="evenodd"/></svg>
  );
}
