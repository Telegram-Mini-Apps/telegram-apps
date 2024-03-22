/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface Devices24Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 24
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const Devices24: Component<Devices24Props> = (props) => {
  const merged = mergeProps({ size: 24 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M3.323 6.773A2.603 2.603 0 0 1 5.926 4.17H20.28a.9.9 0 1 1 0 1.8H5.926a.803.803 0 0 0-.803.803v10.932h8.132a.9.9 0 0 1 0 1.8H1.715a.9.9 0 0 1 0-1.8h1.608zm14.645 3.362a.803.803 0 0 0-.802.803v5.964c0 .443.36.803.802.803h2.616c.444 0 .803-.36.803-.803v-5.965a.803.803 0 0 0-.803-.802zm-2.602.803a2.603 2.603 0 0 1 2.602-2.603h2.616a2.603 2.603 0 0 1 2.603 2.602v5.965a2.603 2.603 0 0 1-2.603 2.603h-2.616a2.603 2.603 0 0 1-2.602-2.603z" clip-rule="evenodd"/></svg>
  );
}
