/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface EllipsisVertical20Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 20
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const EllipsisVertical20: Component<EllipsisVertical20Props> = (props) => {
  const merged = mergeProps({ size: 20 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" width={merged.size} height={merged.size} {...props}><path fill="currentColor" d="M12 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0m0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0m0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0"/></svg>
  );
}
