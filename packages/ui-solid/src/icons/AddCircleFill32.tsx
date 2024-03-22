/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface AddCircleFill32Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 32
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const AddCircleFill32: Component<AddCircleFill32Props> = (props) => {
  const merged = mergeProps({ size: 32 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M16 30c7.732 0 14-6.268 14-14S23.732 2 16 2 2 8.268 2 16s6.268 14 14 14m1-20a1 1 0 1 0-2 0v5h-5a1 1 0 1 0 0 2h5v5a1 1 0 1 0 2 0v-5h5a1 1 0 1 0 0-2h-5z" clip-rule="evenodd"/></svg>
  );
}
