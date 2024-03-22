/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface HeartFill28Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 28
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const HeartFill28: Component<HeartFill28Props> = (props) => {
  const merged = mergeProps({ size: 28 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" width={merged.size} height={merged.size} {...props}><path fill="currentColor" d="M14 5.894a7.63 7.63 0 0 0-3.695-1.792c-1.703-.298-3.586.026-5.222 1.4-1.09.916-1.773 2.357-1.999 3.914a8.5 8.5 0 0 0 .806 4.973c.588 1.184 1.986 2.673 3.44 4.044 1.485 1.402 3.138 2.78 4.348 3.755a3.72 3.72 0 0 0 4.644 0c1.21-.975 2.863-2.353 4.348-3.754 1.454-1.372 2.852-2.861 3.44-4.045a8.5 8.5 0 0 0 .806-4.973c-.226-1.557-.909-2.998-1.999-3.914-1.636-1.374-3.519-1.698-5.222-1.4A7.63 7.63 0 0 0 14 5.894"/></svg>
  );
}
