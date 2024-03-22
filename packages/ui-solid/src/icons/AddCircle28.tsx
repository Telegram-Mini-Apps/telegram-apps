/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface AddCircle28Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 28
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const AddCircle28: Component<AddCircle28Props> = (props) => {
  const merged = mergeProps({ size: 28 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M14 3.9C8.422 3.9 3.9 8.422 3.9 14S8.422 24.1 14 24.1 24.1 19.578 24.1 14 19.578 3.9 14 3.9M2.1 14C2.1 7.428 7.428 2.1 14 2.1S25.9 7.428 25.9 14 20.572 25.9 14 25.9 2.1 20.572 2.1 14M14 8.6a.9.9 0 0 1 .9.9v3.6h3.6a.9.9 0 1 1 0 1.8h-3.6v3.6a.9.9 0 1 1-1.8 0v-3.6H9.5a.9.9 0 1 1 0-1.8h3.6V9.5a.9.9 0 0 1 .9-.9" clip-rule="evenodd"/></svg>
  );
}
