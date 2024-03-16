import type { Component, JSX, JSXElement } from 'solid-js';

export type ComponentSlot<P = {}> = JSXElement | Component<P>;

/**
 * Returns list of properties assuming, that component allows passing custom component.
 */
export type WithComponentProp<
  SelectedTag extends keyof JSX.IntrinsicElements | Component,
  DefaultTag extends keyof JSX.IntrinsicElements,
> = SelectedTag extends Component
  ? { component: SelectedTag }
  : SelectedTag extends keyof JSX.IntrinsicElements
    ? (
      DefaultTag extends SelectedTag
        ? ({ component?: DefaultTag } & JSX.IntrinsicElements[DefaultTag])
        : ({ component: SelectedTag } & JSX.IntrinsicElements[SelectedTag])
      )
    : never;
