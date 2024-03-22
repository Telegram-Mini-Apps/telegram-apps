/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface Notifications24Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 24
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const Notifications24: Component<Notifications24Props> = (props) => {
  const merged = mergeProps({ size: 24 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M12 3.806q-.211 0-.41.012c-1.747.105-2.77.876-3.381 1.759-.637.921-.857 2.018-.857 2.738v3.2c.001.742.001 1.316-.176 1.857q-.054.166-.125.325c-.23.52-.61.94-1.104 1.482l-.081.09c-.476.524-.784.865-.972 1.124.314.036.766.038 1.463.038h11.286c.697 0 1.15-.002 1.463-.038-.189-.26-.496-.6-.972-1.124l-.081-.09c-.494-.543-.875-.962-1.104-1.482a4 4 0 0 1-.125-.325c-.177-.541-.177-1.115-.177-1.857v-3.2c0-.72-.219-1.817-.856-2.738-.61-.883-1.634-1.654-3.382-1.759A7 7 0 0 0 12 3.806m-.512-1.791a9 9 0 0 1 1.024 0c2.29.137 3.8 1.195 4.713 2.516.887 1.283 1.181 2.764 1.181 3.784v3.077c0 .922.01 1.178.085 1.403q.025.08.06.156c.095.216.257.411.87 1.086l.039.043c.446.492.838.924 1.097 1.291.25.355.561.903.397 1.55a1.8 1.8 0 0 1-.211.501c-.35.565-.952.704-1.375.758-.438.057-1.013.057-1.668.057H6.3c-.655 0-1.23 0-1.668-.057-.423-.054-1.025-.193-1.375-.758a1.8 1.8 0 0 1-.211-.5c-.164-.648.148-1.196.397-1.55.259-.368.65-.8 1.097-1.292l.04-.043c.612-.675.774-.87.87-1.086q.033-.076.06-.156c.073-.225.084-.48.084-1.403V8.315c0-1.02.294-2.501 1.181-3.784.913-1.32 2.423-2.379 4.713-2.516" clip-rule="evenodd"/><path fill="currentColor" d="M12 22c.914 0 1.69-.712 1.977-1.706.13-.452-.255-.843-.715-.843h-2.525c-.46 0-.845.39-.715.843C10.308 21.288 11.086 22 12 22"/></svg>
  );
}
