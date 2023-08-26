import type { Component } from 'solid-js';

import type { Box } from './types.js';

const boxSymbol = Symbol('Box');

/**
 * Returns true if passed object is any Box.
 * @param value
 */
export function isBox(value: unknown): value is Box {
  return typeof value === 'object' && value !== null && 'box' in value && value.box === boxSymbol;
}

/**
 * Returns true if passed object is Box of specified type.
 * @param value
 * @param type
 */
export function isBoxOfType<Type extends string>(value: unknown, type: Type): value is Box<Type> {
  return isBox(value) && value.type === type;
}

/**
 * Creates new Box.
 * @param type - Box type identifier.
 * @param Component - component which should be rendered.
 * @param props - properties passed to original component.
 */
export function createBox<Type extends string = string, Props extends object = {}, ViewProps extends object = Props>(
  type: Type,
  Component: Component<ViewProps>,
  props: Props,
): Box<Type, Props, ViewProps> {
  return { box: boxSymbol, type, Component, props };
}