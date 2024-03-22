/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface Actions28Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 28
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const Actions28: Component<Actions28Props> = (props) => {
  const merged = mergeProps({ size: 28 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M14.733 3.9a.847.847 0 0 0-.847.847v.524h1.694v-.524a.847.847 0 0 0-.847-.847m2.647 1.371v-.524a2.647 2.647 0 1 0-5.293 0v.524H9.965A4.865 4.865 0 0 0 5.1 10.136v10.567a4.865 4.865 0 0 0 4.865 4.865h9.037a4.865 4.865 0 0 0 4.865-4.865V10.136a4.865 4.865 0 0 0-4.865-4.865zm-7.415 1.8A3.065 3.065 0 0 0 6.9 10.136v10.567a3.065 3.065 0 0 0 3.065 3.065h9.037a3.065 3.065 0 0 0 3.065-3.065V10.136a3.065 3.065 0 0 0-3.065-3.065zm-.374 3.857a.9.9 0 0 1 .9-.9h7.985a.9.9 0 0 1 0 1.8H10.49a.9.9 0 0 1-.9-.9m0 3.699a.9.9 0 0 1 .9-.9h7.985a.9.9 0 0 1 0 1.8H10.49a.9.9 0 0 1-.9-.9m1.497 3.7a.9.9 0 0 1 .9-.9h4.99a.9.9 0 0 1 0 1.8h-4.99a.9.9 0 0 1-.9-.9" clip-rule="evenodd"/></svg>
  );
}
