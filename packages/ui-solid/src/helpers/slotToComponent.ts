import type { Component } from 'solid-js';

import type { ComponentSlot } from '~/types/components.js';

/**
 * Converts component slot to component.
 * @param value - value to convert.
 */
export function slotToComponent<P>(value: ComponentSlot<P>): Component<P> {
  return typeof value === 'function'
    ? value
    : () => value;
}
