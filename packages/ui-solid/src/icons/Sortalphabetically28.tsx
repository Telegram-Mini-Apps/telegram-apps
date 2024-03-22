/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface Sortalphabetically28Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 28
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const Sortalphabetically28: Component<Sortalphabetically28Props> = (props) => {
  const merged = mergeProps({ size: 28 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M3.1 5.917a.9.9 0 0 1 .9-.9h18.995a.9.9 0 0 1 0 1.8H4a.9.9 0 0 1-.9-.9m0 5.426a.9.9 0 0 1 .9-.9h14.526a.9.9 0 1 1 0 1.8H4a.9.9 0 0 1-.9-.9m0 5.426a.9.9 0 0 1 .9-.9h10.497a.9.9 0 0 1 0 1.8H4a.9.9 0 0 1-.9-.9m17.345-1.829c.404-.91 1.696-.91 2.1 0l3.271 7.38a.9.9 0 0 1-1.645.73l-.763-1.72h-3.827l-.763 1.72a.9.9 0 0 1-1.645-.73zm-.066 4.59h2.231l-1.116-2.517z" clip-rule="evenodd"/></svg>
  );
}
