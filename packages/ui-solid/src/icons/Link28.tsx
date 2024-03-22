/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface Link28Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 28
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const Link28: Component<Link28Props> = (props) => {
  const merged = mergeProps({ size: 28 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M20.874 6.94a5.33 5.33 0 0 0-7.486 0L11.504 8.8a.9.9 0 0 1-1.264-1.282l1.884-1.86a7.128 7.128 0 0 1 10.014 10.148l-1.767 1.743a.9.9 0 1 1-1.264-1.28l1.767-1.744a5.33 5.33 0 0 0 0-7.585M8.904 10.1a.9.9 0 0 1-.008 1.273l-1.767 1.743a5.328 5.328 0 1 0 7.485 7.586l1.885-1.86a.9.9 0 0 1 1.264 1.281l-1.884 1.86A7.128 7.128 0 1 1 5.865 11.835l1.767-1.743a.9.9 0 0 1 1.272.008m8.346.515a.9.9 0 0 1-.009 1.272l-5.216 5.148a.9.9 0 0 1-1.264-1.281l5.216-5.148a.9.9 0 0 1 1.273.009" clip-rule="evenodd"/></svg>
  );
}
