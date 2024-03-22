/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface Calendar24Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 24
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const Calendar24: Component<Calendar24Props> = (props) => {
  const merged = mergeProps({ size: 24 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M7.765 2.1a.9.9 0 0 1 .9.9v.903q.428-.004.928-.003h5.743V3a.9.9 0 1 1 1.8 0v.987A4.666 4.666 0 0 1 20.9 8.565v6.074c0 1.087 0 1.958-.057 2.662-.06.722-.184 1.348-.477 1.924a4.9 4.9 0 0 1-2.141 2.14c-.576.294-1.202.418-1.925.478-.703.057-1.574.057-2.661.057h-3.278c-1.087 0-1.958 0-2.661-.057-.723-.06-1.349-.184-1.925-.477a4.9 4.9 0 0 1-2.14-2.142c-.294-.575-.418-1.2-.478-1.924-.057-.703-.057-1.574-.057-2.661v-4.247c0-1.475 0-2.457.298-3.275a4.9 4.9 0 0 1 2.919-2.919q.26-.095.548-.153V3a.9.9 0 0 1 .9-.9m-.9 3.815a3.1 3.1 0 0 0-1.776 1.82c-.141.385-.177.869-.186 1.95H19.1v-1.12a2.87 2.87 0 0 0-1.965-2.72V6.6a.9.9 0 1 1-1.8 0v-.9h-5.55c-.438 0-.807 0-1.12.005V6.6a.9.9 0 0 1-1.8 0zm12.235 5.57H4.9V14.6c0 1.135 0 1.932.052 2.554.05.611.143.974.286 1.253a3.1 3.1 0 0 0 1.355 1.355c.28.143.642.236 1.253.287.622.05 1.42.051 2.554.051h3.2c1.135 0 1.932 0 2.554-.052.611-.05.974-.143 1.253-.286a3.1 3.1 0 0 0 1.355-1.355c.143-.28.236-.642.287-1.253.05-.622.051-1.42.051-2.554z" clip-rule="evenodd"/></svg>
  );
}
