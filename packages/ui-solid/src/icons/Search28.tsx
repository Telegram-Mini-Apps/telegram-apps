/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface Search28Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 28
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const Search28: Component<Search28Props> = (props) => {
  const merged = mergeProps({ size: 28 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M11.905 4.95a6.953 6.953 0 0 0-6.955 6.951 6.953 6.953 0 0 0 6.955 6.952 6.93 6.93 0 0 0 4.919-2.038 6.953 6.953 0 0 0-4.92-11.865M3.05 11.901c0-4.888 3.965-8.851 8.855-8.851s8.854 3.963 8.854 8.851a8.8 8.8 0 0 1-1.956 5.55l5.87 5.878a.95.95 0 1 1-1.345 1.342l-5.869-5.876a8.82 8.82 0 0 1-5.554 1.958c-4.89 0-8.855-3.963-8.855-8.852" clip-rule="evenodd"/></svg>
  );
}
