/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface NotificationsColoredSquare32Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 32
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const NotificationsColoredSquare32: Component<NotificationsColoredSquare32Props> = (props) => {
  const merged = mergeProps({ size: 32 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" width={merged.size} height={merged.size} {...props}><path fill="#FF3A30" d="M1 10.6c0-3.36 0-5.04.654-6.324a6 6 0 0 1 2.622-2.622C5.56 1 7.24 1 10.6 1h10.8c3.36 0 5.04 0 6.324.654a6 6 0 0 1 2.622 2.622C31 5.56 31 7.24 31 10.6v10.8c0 3.36 0 5.04-.654 6.324a6 6 0 0 1-2.622 2.622C26.44 31 24.76 31 21.4 31H10.6c-3.36 0-5.04 0-6.324-.654a6 6 0 0 1-2.622-2.622C1 26.44 1 24.76 1 21.4z"/><path fill="#fff" d="M9.417 21.419q-.589 0-.92-.274a.9.9 0 0 1-.333-.73q0-.416.24-.806.241-.39.598-.763.366-.374.723-.747a1.9 1.9 0 0 0 .423-.74q.158-.456.232-.97t.108-.996q.025-1.595.34-2.84.316-1.245.988-2.091.682-.848 1.785-1.245.232-.814.855-1.378.622-.565 1.536-.565.565 0 1.029.233a4.2 4.2 0 0 0-.697 1.187 3.9 3.9 0 0 0-.258 1.403q0 1.095.54 2.008a4.2 4.2 0 0 0 1.453 1.461q.912.54 2.017.54.357 0 .689-.066a4 4 0 0 0 .647-.191q.042.365.058.755.025.382.033.789.034.48.108.996.075.514.224.97.159.457.432.74l.714.747q.364.373.606.763.24.39.24.806 0 .456-.331.73-.333.274-.922.274zm6.575 3.329q-.697 0-1.254-.308a2.6 2.6 0 0 1-.896-.805 2.2 2.2 0 0 1-.39-1.079h5.088a2.3 2.3 0 0 1-.398 1.08q-.333.497-.889.804-.555.308-1.261.308m4.092-11.77q-.796 0-1.453-.391a3 3 0 0 1-1.037-1.046 2.77 2.77 0 0 1-.39-1.444q0-.788.39-1.445a3 3 0 0 1 1.037-1.046q.657-.39 1.453-.39.78 0 1.436.39.656.391 1.046 1.046.39.657.39 1.445t-.39 1.444-1.046 1.046-1.436.39"/></svg>
  );
}
