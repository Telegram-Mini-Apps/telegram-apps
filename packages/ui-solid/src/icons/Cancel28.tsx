/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface Cancel28Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 28
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const Cancel28: Component<Cancel28Props> = (props) => {
  const merged = mergeProps({ size: 28 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M5.306 5.231a1 1 0 0 1 1.414-.009l7.282 7.186 7.282-7.186a1 1 0 0 1 1.405 1.424l-7.263 7.167 7.263 7.168a1 1 0 0 1-1.405 1.423l-7.282-7.186-7.282 7.186a1 1 0 0 1-1.405-1.423l7.263-7.168-7.263-7.167a1 1 0 0 1-.01-1.415" clip-rule="evenodd"/></svg>
  );
}
