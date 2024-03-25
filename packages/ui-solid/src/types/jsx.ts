import type { JSX } from 'solid-js';

/**
 * JSX intrinsic element.
 */
export type JSXIntrinsicElement = keyof JSX.IntrinsicElements;

/**
 * Returns JSX intrinsic element attributes.
 */
export type JSXIntrinsicElementAttrs<Element extends JSXIntrinsicElement> =
  JSX.IntrinsicElements[Element];
