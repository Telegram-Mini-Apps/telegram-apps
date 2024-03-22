/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface Smile24Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 24
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const Smile24: Component<Smile24Props> = (props) => {
  const merged = mergeProps({ size: 24 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={merged.size} height={merged.size} {...props}><path fill="currentColor" d="M10.715 9.73c0 .7-.48 1.268-1.072 1.268s-1.071-.568-1.071-1.269c0-.7.48-1.269 1.071-1.269.592 0 1.072.568 1.072 1.27m5.143 0c0 .7-.48 1.268-1.072 1.268-.591 0-1.071-.568-1.071-1.269 0-.7.48-1.269 1.071-1.269.592 0 1.072.568 1.072 1.27"/><path fill="currentColor" fill-rule="evenodd" d="M12 4.285c-4.248 0-7.671 3.395-7.671 7.559S7.752 19.403 12 19.403s7.671-3.396 7.671-7.56S16.248 4.285 12 4.285m-9.47 7.559c0-5.18 4.252-9.36 9.472-9.36s9.471 4.18 9.471 9.36-4.252 9.359-9.471 9.359-9.472-4.18-9.472-9.36m12.773 1.266a.9.9 0 0 1 .547 1.15l-.85-.301.848.301v.002l-.002.002-.002.005-.004.012a2 2 0 0 1-.052.124c-.033.072-.08.167-.145.276-.129.218-.33.5-.627.78-.611.574-1.58 1.09-3.016 1.09-1.437 0-2.405-.516-3.017-1.09a3.6 3.6 0 0 1-.627-.78 3 3 0 0 1-.197-.4l-.004-.012-.002-.005-.001-.002v-.002L9 13.96l-.848.3a.9.9 0 1 1 1.698-.601q.013.032.056.107c.059.1.158.24.31.384.29.27.82.601 1.785.601.963 0 1.495-.33 1.783-.601a1.8 1.8 0 0 0 .367-.491l.007-.014a.9.9 0 0 1 1.144-.534m-5.454.546v.002l-.804.285c.805-.285.804-.286.804-.286z" clip-rule="evenodd"/></svg>
  );
}
