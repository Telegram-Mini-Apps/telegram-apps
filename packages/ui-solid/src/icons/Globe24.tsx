/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface Globe24Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 24
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const Globe24: Component<Globe24Props> = (props) => {
  const merged = mergeProps({ size: 24 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M4.217 9.75A8.1 8.1 0 0 0 3.9 12c0 .78.11 1.536.317 2.25h3.41A19 19 0 0 1 7.5 12q.002-1.204.127-2.25zm.767-1.8H7.94c.358-1.516.9-2.719 1.495-3.635A8.12 8.12 0 0 0 4.984 7.95M12 4.076c-.652.534-1.623 1.737-2.205 3.874h4.41C13.623 5.813 12.652 4.61 12 4.076m2.56 5.674H9.44A17 17 0 0 0 9.3 12c0 .82.05 1.569.14 2.25h5.12c.09-.681.14-1.43.14-2.25s-.05-1.569-.14-2.25m1.813 4.5q.125-1.046.127-2.25c0-.803-.045-1.552-.127-2.25h3.41c.206.713.317 1.468.317 2.25s-.11 1.537-.316 2.25zm-2.168 1.8h-4.41c.582 2.137 1.553 3.34 2.205 3.874.652-.534 1.623-1.737 2.205-3.874m-4.77 3.635c-.596-.916-1.137-2.119-1.495-3.635H4.984a8.12 8.12 0 0 0 4.45 3.635m5.13 0c.596-.916 1.137-2.119 1.495-3.635h2.957a8.12 8.12 0 0 1-4.452 3.635M19.017 7.95H16.06c-.358-1.516-.9-2.719-1.495-3.635a8.12 8.12 0 0 1 4.452 3.635M2.1 12c0-5.468 4.432-9.9 9.9-9.9a9.9 9.9 0 0 1 9.276 6.435A9.9 9.9 0 0 1 21.9 12c0 1.217-.22 2.385-.624 3.465A9.9 9.9 0 0 1 12 21.9c-5.468 0-9.9-4.432-9.9-9.9" clip-rule="evenodd"/></svg>
  );
}
