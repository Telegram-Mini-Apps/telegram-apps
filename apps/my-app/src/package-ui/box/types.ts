import type { Component } from 'solid-js';

/**
 * Represents child element meta data.
 */
export interface Box<Type extends string = string,
  OriginalProps extends object = {},
  ViewProps extends object = OriginalProps> {
  /**
   * Unique property which identifies object as Box.
   */
  box: symbol;

  /**
   * Unique box type. Usually used to determine the type of the box.
   */
  type: Type;

  /**
   * Component to be used by parent to render the box.
   */
  Component: Component<ViewProps>;

  /**
   * Component properties passed to the component produced the box.
   */
  props: OriginalProps;
}