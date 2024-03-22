/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface Lock24Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 24
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const Lock24: Component<Lock24Props> = (props) => {
  const merged = mergeProps({ size: 24 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M11.77 3.365a3.553 3.553 0 0 0-3.553 3.553v1.507h7.106V6.918a3.553 3.553 0 0 0-3.553-3.553m5.353 5.064V6.918a5.353 5.353 0 0 0-10.706 0v1.518a3.2 3.2 0 0 0-.853.141 2.89 2.89 0 0 0-1.807 1.808c-.154.455-.154.983-.153 1.62v6.067c0 .527 0 .975.03 1.343.032.387.1.764.285 1.124.276.543.718.985 1.261 1.262.36.184.737.253 1.124.284.369.03.817.03 1.343.03h8.715c.526 0 .974 0 1.342-.03.387-.031.764-.1 1.125-.284a2.9 2.9 0 0 0 1.261-1.262c.184-.36.253-.737.285-1.124.03-.368.03-.816.03-1.343v-5.604c0-.526 0-.975-.03-1.343-.032-.387-.101-.764-.285-1.124a2.9 2.9 0 0 0-1.261-1.262c-.36-.183-.738-.253-1.125-.284a9 9 0 0 0-.58-.026m-9.806 1.796c-.842 0-1.04.012-1.175.057-.32.109-.572.36-.68.68-.046.135-.058.333-.058 1.175v5.9c0 .571 0 .945.024 1.231.023.276.062.39.094.454.105.205.27.37.475.475.065.033.178.072.454.094.286.024.66.024 1.231.024h8.644c.572 0 .946 0 1.232-.024.275-.022.39-.061.454-.094.204-.104.37-.27.474-.475.033-.064.072-.178.095-.454.023-.286.024-.66.024-1.231v-5.534c0-.571 0-.945-.024-1.231-.023-.276-.062-.39-.095-.454a1.1 1.1 0 0 0-.474-.475c-.065-.033-.179-.072-.454-.094-.286-.024-.66-.024-1.232-.024z" clip-rule="evenodd"/><ellipse cx="12.004" cy="15.294" fill="currentColor" rx="1.501" ry="1.481"/></svg>
  );
}
