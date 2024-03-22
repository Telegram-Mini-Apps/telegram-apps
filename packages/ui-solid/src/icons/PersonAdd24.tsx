/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface PersonAdd24Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 24
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const PersonAdd24: Component<PersonAdd24Props> = (props) => {
  const merged = mergeProps({ size: 24 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M15.11 5.13c-1.647 0-2.927 1.28-2.927 2.792 0 1.51 1.28 2.79 2.928 2.79s2.927-1.28 2.927-2.79-1.28-2.792-2.927-2.792m-4.727 2.792c0-2.566 2.148-4.592 4.728-4.592s4.727 2.026 4.727 4.592-2.147 4.59-4.727 4.59-4.728-2.024-4.728-4.59m-5.798-.9a.9.9 0 0 1 .9.9V9.79h1.97a.9.9 0 1 1 0 1.8h-1.97v1.869a.9.9 0 1 1-1.8 0V11.59h-1.97a.9.9 0 0 1 0-1.8h1.97V7.922a.9.9 0 0 1 .9-.9m10.526 8.72c-4.926 0-6.172 2.756-6.281 3.807a.9.9 0 1 1-1.79-.185c.21-2.025 2.28-5.421 8.07-5.421 5.792 0 7.863 3.396 8.073 5.42a.9.9 0 0 1-1.79.186c-.11-1.05-1.356-3.806-6.282-3.806" clip-rule="evenodd"/></svg>
  );
}
