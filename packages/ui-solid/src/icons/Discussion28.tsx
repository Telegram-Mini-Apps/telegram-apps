/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface Discussion28Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 28
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const Discussion28: Component<Discussion28Props> = (props) => {
  const merged = mergeProps({ size: 28 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M14 4.9c-5.117 0-9.1 3.713-9.1 8.1 0 1.955.779 3.759 2.098 5.172.316.339.55.822.52 1.377-.045.855-.222 2.144-.687 3.301 1.456-.379 2.836-1.112 3.664-1.655.441-.29.98-.396 1.502-.292.643.129 1.314.197 2.003.197 5.117 0 9.1-3.713 9.1-8.1S19.117 4.9 14 4.9M3.1 13c0-5.554 4.972-9.9 10.9-9.9S24.9 7.446 24.9 13s-4.972 9.9-10.9 9.9c-.808 0-1.597-.08-2.356-.232a.22.22 0 0 0-.162.032c-1.07.703-3.004 1.724-5.04 2.075-.699.12-1.213-.3-1.443-.727a1.58 1.58 0 0 1-.023-1.462c.49-.952.697-2.243.745-3.128l-.002-.004a.2.2 0 0 0-.037-.054C4.08 17.684 3.1 15.451 3.1 13m5.79-1.572a.9.9 0 0 1 .9-.9h8.947a.9.9 0 0 1 0 1.8H9.789a.9.9 0 0 1-.9-.9m0 4a.9.9 0 0 1 .9-.9h6.842a.9.9 0 0 1 0 1.8H9.789a.9.9 0 0 1-.9-.9" clip-rule="evenodd"/></svg>
  );
}
