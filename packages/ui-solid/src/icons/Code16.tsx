/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface Code16Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 16
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const Code16: Component<Code16Props> = (props) => {
  const merged = mergeProps({ size: 16 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M9.218 2.627a.9.9 0 0 1 .655 1.091l-2 8a.9.9 0 1 1-1.746-.436l2-8a.9.9 0 0 1 1.091-.655M5.136 4.364a.9.9 0 0 1 0 1.272L3.273 7.5l1.863 1.864a.9.9 0 0 1-1.272 1.272l-2.5-2.5a.9.9 0 0 1 0-1.272l2.5-2.5a.9.9 0 0 1 1.272 0m5.728 0a.9.9 0 0 1 1.272 0l2.5 2.5a.9.9 0 0 1 0 1.272l-2.5 2.5a.9.9 0 1 1-1.272-1.272L12.727 7.5l-1.863-1.864a.9.9 0 0 1 0-1.272" clip-rule="evenodd"/></svg>
  );
}
