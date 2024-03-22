/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface Check16Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 16
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const Check16: Component<Check16Props> = (props) => {
  const merged = mergeProps({ size: 16 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M14.183 3.325a1.13 1.13 0 0 1 0 1.572l-7.584 7.778a1.064 1.064 0 0 1-1.532 0L1.817 9.34a1.13 1.13 0 0 1 0-1.571 1.064 1.064 0 0 1 1.532 0l2.484 2.548 6.818-6.993a1.064 1.064 0 0 1 1.532 0" clip-rule="evenodd"/></svg>
  );
}
