/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface ChevronVertical20Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 20
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const ChevronVertical20: Component<ChevronVertical20Props> = (props) => {
  const merged = mergeProps({ size: 20 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M9.374 2.353a.9.9 0 0 1 1.252 0l4.5 4.356a.9.9 0 1 1-1.252 1.293L10 4.252l-3.874 3.75A.9.9 0 1 1 4.874 6.71zm-4.52 9.665a.9.9 0 0 1 1.272-.02L10 15.748l3.874-3.75a.9.9 0 1 1 1.252 1.293l-4.5 4.356a.9.9 0 0 1-1.252 0l-4.5-4.356a.9.9 0 0 1-.02-1.273" clip-rule="evenodd"/></svg>
  );
}
