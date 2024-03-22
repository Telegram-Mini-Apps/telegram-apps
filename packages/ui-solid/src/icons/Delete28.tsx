/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface Delete28Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 28
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const Delete28: Component<Delete28Props> = (props) => {
  const merged = mergeProps({ size: 28 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M13.709 2.559h.575c.143 0 .248 0 .342.005a3.68 3.68 0 0 1 3.423 2.955h4.445a.9.9 0 0 1 0 1.8H5.5a.9.9 0 1 1 0-1.8h4.445a3.68 3.68 0 0 1 3.423-2.955c.094-.005.199-.005.342-.005m-1.892 2.96h4.36a1.88 1.88 0 0 0-1.642-1.158 7 7 0 0 0-.275-.002h-.527c-.178 0-.233 0-.275.002a1.88 1.88 0 0 0-1.642 1.158M6.7 9.687a.9.9 0 0 1 1 .787l1.038 8.695c.142 1.19.24 1.997.391 2.6.145.577.312.85.52 1.034s.498.318 1.089.393c.615.08 1.429.08 2.627.08h1.263c1.198 0 2.012 0 2.628-.08.59-.075.88-.209 1.088-.393s.375-.457.52-1.035c.151-.602.25-1.41.391-2.6l1.038-8.694a.9.9 0 0 1 1.788.213l-1.045 8.754c-.134 1.116-.244 2.039-.426 2.766-.192.764-.489 1.425-1.07 1.942-.583.517-1.275.733-2.056.833-.744.095-1.673.095-2.797.095h-1.38c-1.125 0-2.054 0-2.798-.095-.781-.1-1.473-.316-2.055-.833s-.88-1.178-1.07-1.942c-.183-.727-.293-1.65-.427-2.766l-1.044-8.754a.9.9 0 0 1 .787-1" clip-rule="evenodd"/></svg>
  );
}
