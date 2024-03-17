import type { Component, JSXElement } from 'solid-js';

import type { JSXIntrinsicElement, JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export type ComponentSlot<P = {}> = JSXElement | Component<P>;

/**
 * Returns list of properties assuming, that component allows passing custom component.
 */
export type WithComponentProp<
  SelectedTag extends JSXIntrinsicElement,
  DefaultTag extends JSXIntrinsicElement,
> = SelectedTag extends JSXIntrinsicElement
  ? DefaultTag extends SelectedTag
    ? (JSXIntrinsicElementAttrs<SelectedTag> & { component?: SelectedTag })
    : (JSXIntrinsicElementAttrs<SelectedTag> & { component: SelectedTag })
  : never;
