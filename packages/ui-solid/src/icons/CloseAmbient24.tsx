/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface CloseAmbient24Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 24
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const CloseAmbient24: Component<CloseAmbient24Props> = (props) => {
  const merged = mergeProps({ size: 24 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={merged.size} height={merged.size} {...props}><g clip-path="url(#a)"><path fill="#000" fill-opacity=".1" d="M12 24c6.565 0 12-5.447 12-12 0-6.565-5.447-12-12.012-12C5.435 0 0 5.435 0 12c0 6.553 5.447 12 12 12"/><path fill="#fff" d="M7.862 17.143a1.005 1.005 0 0 1-1.005-1.019c0-.27.098-.528.294-.712L10.547 12 7.151 8.6a.98.98 0 0 1-.294-.712.987.987 0 0 1 1.005-1.006c.282 0 .503.098.7.282l3.42 3.412 3.445-3.424a.93.93 0 0 1 .698-.295c.564 0 1.018.442 1.018 1.007a.95.95 0 0 1-.307.724L13.428 12l3.396 3.4a.94.94 0 0 1 .307.724c0 .565-.454 1.019-1.03 1.019a.97.97 0 0 1-.724-.295l-3.395-3.412-3.384 3.412a1.02 1.02 0 0 1-.736.295"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h24v24H0z"/></clipPath></defs></svg>
  );
}
