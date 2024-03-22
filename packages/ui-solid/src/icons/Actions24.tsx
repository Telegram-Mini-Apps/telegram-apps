/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface Actions24Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 24
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const Actions24: Component<Actions24Props> = (props) => {
  const merged = mergeProps({ size: 24 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M12.648 3.44a.6.6 0 0 0-.6.6v.323h1.2v-.324a.6.6 0 0 0-.6-.6m2.4.923v-.324a2.4 2.4 0 1 0-4.8 0v.324H8.553a4.305 4.305 0 0 0-4.306 4.305v9.076a4.305 4.305 0 0 0 4.306 4.305h7.761a4.305 4.305 0 0 0 4.305-4.305V8.668a4.305 4.305 0 0 0-4.305-4.305zm-6.495 1.8a2.505 2.505 0 0 0-2.506 2.505v9.076a2.505 2.505 0 0 0 2.506 2.505h7.761a2.505 2.505 0 0 0 2.506-2.505V8.668a2.505 2.505 0 0 0-2.506-2.505zm-.448 3.185a.9.9 0 0 1 .9-.9h6.857a.9.9 0 1 1 0 1.8H9.005a.9.9 0 0 1-.9-.9m0 3.177a.9.9 0 0 1 .9-.9h6.857a.9.9 0 0 1 0 1.8H9.005a.9.9 0 0 1-.9-.9m1.285 3.177a.9.9 0 0 1 .9-.9h4.286a.9.9 0 0 1 0 1.8H10.29a.9.9 0 0 1-.9-.9" clip-rule="evenodd"/></svg>
  );
}
