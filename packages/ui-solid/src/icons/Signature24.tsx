/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface Signature24Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 24
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const Signature24: Component<Signature24Props> = (props) => {
  const merged = mergeProps({ size: 24 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M2.53 5.07a.9.9 0 0 1 .9-.9h12.857a.9.9 0 1 1 0 1.8H3.429a.9.9 0 0 1-.9-.9m0 4.229a.9.9 0 0 1 .9-.9h6.428a.9.9 0 1 1 0 1.8H3.429a.9.9 0 0 1-.9-.9m10.803.195c.603-.177 1.224-.058 1.775.35l.024.018.022.019c.888.751 1.116 1.755.943 2.743-.163.93-.677 1.869-1.286 2.719-.545.76-1.213 1.511-1.903 2.2.213-.008.5-.059.883-.192.846-.428 1.911-1.267 2.742-1.998.711-.625 1.818-.372 2.218.412l1.327-.874a.9.9 0 1 1 .99 1.504l-1.8 1.184a1.4 1.4 0 0 1-1.994-.489c-.812.683-1.828 1.452-2.732 1.898l-.046.023-.048.017c-1.05.377-2.011.446-2.799.053a2 2 0 0 1-.251-.145c-.35.299-.685.57-.992.805a.9.9 0 1 1-1.096-1.428c.327-.251.685-.542 1.055-.862a4 4 0 0 1-.067-.256c-.315-1.398.047-3.196.416-4.361l.003-.008.003-.009c.232-.687.686-1.7 1.32-2.428.316-.363.746-.736 1.293-.895m-1.355 6.427c.504-.527.977-1.079 1.37-1.627.548-.764.881-1.443.976-1.981.082-.468-.016-.779-.31-1.038-.109-.075-.15-.062-.172-.055l-.004.001c-.077.023-.232.11-.44.35-.414.475-.773 1.234-.97 1.814-.247.78-.437 1.727-.45 2.536m-9.449-2.816a.9.9 0 0 1 .9-.9h4.286a.9.9 0 1 1 0 1.8H3.429a.9.9 0 0 1-.9-.9" clip-rule="evenodd"/></svg>
  );
}
