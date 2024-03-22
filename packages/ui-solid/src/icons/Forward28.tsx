/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface Forward28Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 28
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const Forward28: Component<Forward28Props> = (props) => {
  const merged = mergeProps({ size: 28 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M14.341 4.261a.99.99 0 0 0 .01 1.4l5.965 5.887H15.64c-2.24 0-4.01 0-5.409.166-1.434.17-2.607.528-3.583 1.336q-.474.392-.865.865c-.809.976-1.166 2.15-1.337 3.584-.166 1.398-.166 3.168-.166 5.409v.065a.99.99 0 0 0 1.979 0c0-2.32.001-3.972.152-5.24.148-1.247.429-1.992.896-2.556a4.6 4.6 0 0 1 .603-.603c.564-.467 1.309-.747 2.555-.895 1.268-.151 2.92-.153 5.24-.153h4.612l-5.267 5.198a.99.99 0 0 0 1.39 1.409l6.983-6.892a.99.99 0 0 0 0-1.408L15.74 4.252a.99.99 0 0 0-1.399.01" clip-rule="evenodd"/></svg>
  );
}
