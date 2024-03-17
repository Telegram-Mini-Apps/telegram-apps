import type { JSX } from 'solid-js';

export type JSXIntrinsicElement = keyof JSX.IntrinsicElements;

export type JSXIntrinsicElementAttrs<Element extends JSXIntrinsicElement> =
  JSX.IntrinsicElements[Element];

export type JSXHTMLIntrinsicElement = keyof JSX.HTMLElementTags;
