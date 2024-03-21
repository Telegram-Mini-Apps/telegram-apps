import type { Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '../types/jsx.js';

export const IconChevronUp24: Component<JSXIntrinsicElementAttrs<'svg'>> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}><path fill="currentColor" fill-rule="evenodd" d="M4.293 16.207a1 1 0 0 0 1.414 0L12.5 9.414l6.793 6.793a1 1 0 0 0 1.414-1.414l-7.5-7.5a1 1 0 0 0-1.414 0l-7.5 7.5a1 1 0 0 0 0 1.414" clip-rule="evenodd"/></svg>
  );
};
